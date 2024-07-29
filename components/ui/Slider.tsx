import { useScript } from "apps/utils/useScript.ts";
import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

function Dot(
  { index, ...props }: { index: number } & JSX.IntrinsicElements["button"],
) {
  return (
    <button
      {...props}
      data-dot={index}
      aria-label={`go to slider item ${index}`}
      class={clx("focus:outline-none group", props.class?.toString())}
    />
  );
}

function Slider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

function View(props: JSX.IntrinsicElements["div"]) {
  return <div data-slider-view {...props} style={{ position: "relative" }} />;
}

function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & { index: number }) {
  return <li data-slider-item={index} {...props} />;
}

function NextButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      disabled
      data-slide="next"
      aria-label="Next item"
      {...props}
    />
  );
}

function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button disabled data-slide="prev" aria-label="Previous item" {...props} />
  );
}

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
}

const onLoad = ({ rootId, scroll: _scroll, interval, infinite }: Props) => {
  function init() {
    // Percentage of the item that has to be inside the container
    // for it it be considered as inside the container
    const THRESHOLD = 0.6;

    // as any are ok in typeguard functions
    const isHTMLElement = (x: Element): x is HTMLElement =>
      // deno-lint-ignore no-explicit-any
      typeof (x as any).offsetLeft === "number";

    const root = document.getElementById(rootId);
    const view = root?.querySelector("[data-slider-view]");
    const slider = root?.querySelector("[data-slider]") as HTMLUListElement;
    const items = root?.querySelectorAll("[data-slider-item]");
    const prev = root?.querySelector('[data-slide="prev"]');
    const next = root?.querySelector('[data-slide="next"]');
    const dots = root?.querySelectorAll("[data-dot]");

    if (!root || !slider || !items || items.length === 0) {
      console.warn(
        "Missing necessary slider attributes. It will not work as intended. Necessary elements:",
        { root, slider, items, rootId, view },
      );

      return;
    }
    const PERCENT_OF_PRODUCT_VIEW = 100;
    items.forEach((item, index) =>
      (item as HTMLLIElement).style.transform = `translateX(${PERCENT_OF_PRODUCT_VIEW * index
      }%)`
    );

    let itemIndex = 0;
    const MIN_ELEMENTS = 0;
    const MAX_INDEX = items.length - 1;

    const goToItem = (index: number) => {
      const item = items.item(index);

      if (!isHTMLElement(item)) {
        console.warn(
          `Element at index ${index} is not an html element. Skipping carousel`,
        );

        return;
      }

      const percentOfView =
        ((items.item(0) as HTMLLIElement).offsetWidth / root.offsetWidth) * 100;
      items.forEach((item, itemIndex) => {
        if (itemIndex < index) {
          (item as HTMLLIElement).style.transform = `translateX(${PERCENT_OF_PRODUCT_VIEW * (itemIndex + MAX_INDEX + 1)
            }%)`;
        } else {
          (item as HTMLLIElement).style.transform = `translateX(${PERCENT_OF_PRODUCT_VIEW * itemIndex
            }%)`;
        }
      });

      slider.style.transform = `translateX(-${percentOfView * index}%)`;
    };

    const onClickPrev = () => {
      const prevIndex = (itemIndex - 1) % items.length;
      itemIndex = prevIndex < MIN_ELEMENTS ? MAX_INDEX : prevIndex;
      goToItem(itemIndex);
    };

    const onClickNext = () => {
      const nextIndex = (itemIndex + 1) % items.length;
      itemIndex = nextIndex;
      goToItem(itemIndex);
    };

    const observer = new IntersectionObserver(
      (elements) =>
        elements.forEach((e) => {
          const item = e.target.getAttribute("data-slider-item");
          const index = Number(item) || 0;
          const dot = dots?.item(index);

          if (e.isIntersecting) {
            dot?.setAttribute("disabled", "");
          } else {
            dot?.removeAttribute("disabled");
          }

          if (!infinite) {
            if (index === 0) {
              prev?.removeAttribute("disabled");
            }
            if (index === items.length - 1) {
              next?.removeAttribute("disabled");
            }
          }
        }),
      { threshold: THRESHOLD, root: slider },
    );

    items.forEach((item) => observer.observe(item));

    for (let it = 0; it < (dots?.length ?? 0); it++) {
      dots?.item(it).addEventListener("click", () => goToItem(it));
    }

    prev?.addEventListener("click", onClickPrev);
    next?.addEventListener("click", onClickNext);

    if (interval) {
      setInterval(onClickNext, interval);
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
};

function JS({ rootId, scroll = "smooth", interval, infinite = false }: Props) {
  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{
        __html: useScript(onLoad, { rootId, scroll, interval, infinite }),
      }}
    />
  );
}

Slider.View = View;
Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;
Slider.JS = JS;

export default Slider;
