import Icon from "../../components/ui/Icon.tsx"

export interface Props {
    text: string;
}

function Footer({ text }: Props) {
    return (
        <div class="bg-[#010214]">
            <footer class="container pt-10 border-t border-[#343543]">
                <p class="text-white">{text}</p>
                <a class="w-[60px] h-[60px] bg-transparent rounded-full border border-white" href="#top">
                    <Icon id="ArrowUP" width={36} height={36} />
                </a>
            </footer>
        </div>
    );
}

export default Footer;