import {registerServiceWorker} from "lib/registerSw";
import {createSignal, onMount} from "solid-js";
import Backdrop, {Description} from "@Components/Backdrop";
import {TextButton} from "@Components/Primitive/Button";
import {buttonSounds} from "@Common/Audio/AudioSource";

function ServiceWorker() {

    const [pwa, setPwa] = createSignal({
        needsRefresh: false,
        refreshCb: null as () => void
    })

    onMount(() => {
        registerServiceWorker({
            onNeedRefresh: (updateSw) => {
                setPwa({needsRefresh: true, refreshCb: updateSw})
            }
        })
    })

    function UpdateServiceWorker() {
        buttonSounds.onClick()
        pwa().refreshCb()
    }


    return <Backdrop
        when={pwa().needsRefresh}
        onBackgroundClick={() => {
        }}
        title="Update Found"
        description={
            <Description>
                An update was found click 'Update' to get the newest
                version
            </Description>
        }>
        <TextButton onClick={UpdateServiceWorker}>Update</TextButton>
    </Backdrop>
}


export default ServiceWorker