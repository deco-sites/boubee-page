import Icon from "../../components/ui/Icon.tsx";

export interface Props {
  text: string;
}

function Footer({ text }: Props) {
  return (
    <div class="bg-[#010214]">
      <footer class="container flex justify-between items-center py-10 border-t border-[#343543]">
        <p class="text-white">{text}</p>
        <a
          class="w-[60px] h-[60px] bg-transparent flex items-center justify-center flex-shrink-0 rounded-full border border-white"
          href="#top"
        >
          <Icon id="ArrowUP" width={36} height={36} />
        </a>
      </footer>
    </div>
  );
}

export default Footer;
