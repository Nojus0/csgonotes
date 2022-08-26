import base58 from "bs58";
import {
    batch,
    Component,
    createEffect,
    createSignal,
    onMount,
} from "solid-js";
import {
    AES_KEY_BITS,
    DetailedKeypair,
    serializeKeyPair,
    VERSION,
} from "@common/KeyPair";
import Backdrop, {Description} from "./Backdrop";
import {useStateContext} from "@common/Context/StateContext";
import {TextButton} from "./Primitive/Button";
import {buttonSounds} from "@common/audio/AudioSource";
import {decryptNotes, encryptNotes} from "@common/Notes";

export function InspectUri() {
    const url = new URL(location.href);
    const params = url.searchParams;

    const key = params.get("key");
    const iv = params.get("iv");
    const notes = params.get("notes") || params.get("list");

    return {
        key,
        iv,
        notes,
        IsSerializedLink: key && iv && notes,
    };
}

const CopyBackdrop: Component = () => {
    const ctx = useStateContext();
    const [text, setText] = createSignal("5");
    let timer: NodeJS.Timer;

    createEffect(() => {
        if (!ctx.showCopyClipboard) {
            clearInterval(timer);
            setText("5");
            return;
        }

        timer = setInterval(() => {
            const num = parseInt(text());
            if (num > 0) {
                setText(`${num - 1}`);
                buttonSounds.onMouseEnter();
            } else {
                buttonSounds.onMouseEnter();
                setText("Copy");
                clearInterval(timer);
                return;
            }
        }, 1000);
    });

    onMount(async () => {
        const {iv, key, notes, IsSerializedLink} = InspectUri();
        if (!IsSerializedLink) return;

        const keypair: DetailedKeypair = {
            key: await crypto.subtle.importKey(
                "raw",
                base58.decode(key),
                {
                    name: "AES-GCM",
                    hash: "SHA-512",
                    length: AES_KEY_BITS,
                },
                true,
                ["encrypt", "decrypt"]
            ),
            iv: base58.decode(iv),
            version: VERSION,
        };

        const listStore = await decryptNotes(keypair, base58.decode(notes));

        // * VERY IMPORTANT *
        batch(() => {
            ctx.setShowTopbar(true);
            ctx.setKeyPair({...keypair, handle: null, loaded: true});
            ctx.setNotes({...listStore, handle: null, loaded: true});
        });
    });

    async function copyToClipboard() {
        const url = new URL(location.href);
        const p = url.searchParams;
        const s = await serializeKeyPair(ctx.keypair);
        p.set("key", s.key);
        p.set("iv", s.iv);
        p.set(
            "notes",
            base58.encode(new Uint8Array(await encryptNotes(ctx.keypair, ctx.notes)))
        );

        await navigator.clipboard.writeText(url.href);
    }

    return (
        <Backdrop
            title="Copy to Clipboard"
            width="32.5rem"
            description={
                <>
                    <Description>
                        Encode the Key and the Notes into a sharable URL.
                    </Description>
                    <Description>
                        The data is stored directly in the URL and it does not auto-update.
                    </Description>
                </>
            }
            onBackgroundClick={() => ctx.setCopyClipboard(false)}
            when={ctx.showCopyClipboard}
        >
            <TextButton
                onClick={() => {
                    buttonSounds.onClick();
                    ctx.setCopyClipboard(false);
                }}
            >
                Close
            </TextButton>
            <TextButton
                onClick={() => {
                    if (ctx.showCopyClipboard && text() == "Copy") {
                        copyToClipboard();
                        buttonSounds.onClick();
                    }
                }}
            >
                {text()}
            </TextButton>
        </Backdrop>
    );
};

export default CopyBackdrop;
