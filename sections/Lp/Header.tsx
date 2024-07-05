import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
    logo: ImageWidget;
    buttonLink: string;
}

function Header({ logo, buttonLink }: Props) {
    return (
        <header class="fixed h-20 w-full top-0" id="#top">
            <div class="container justify-between items-center h-full">
                <Image src={logo} width={107} height={28} />
                <a href="#waitlist" class="w-[195px] h-[52px] flex items-center justify-center rounded-full bg-transparent text-white">Join the waitlist today!</a>
                <a class="w-[132px] rounded-full bg-[#3c2790] flex items-center justify-center text-white" href={buttonLink}>👋  Talk to CEO</a>
            </div>
        </header>
    );
}

export default Header;