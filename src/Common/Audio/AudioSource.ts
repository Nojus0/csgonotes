import {play} from "@Common/Audio/Preload";

const S = import.meta.env.VITE_NO_THIRD_PARTY_SERVER_MODE == "true"
const AudioSource = {
    Button: {
        Click: S ? "/static/sound/generic_press_01.wav" : "https://media.vocaroo.com/mp3/1mvXUebjUbYo",
        MouseOver: S ? "/static/sound/itemtile_rollover_09.wav" : "https://media.vocaroo.com/mp3/1dAHcxcXWPMz",
        Quit: S ? "/static/sound/mainmenu_press_quit_02.wav" : "https://media.vocaroo.com/mp3/1cya9hq3V6n8",
    },
    Ambience: {
        Anubis: S ? "/static/sound/bg_anubis_01.ogg" : "https://media.vocaroo.com/mp3/11WObh4EkZWH",
        Blacksite: S ? "/static/sound/bg_blacksite_01.ogg" : "https://media.vocaroo.com/mp3/1lhrFS62sHBN",
        Chlorine: S ? "/static/sound/bg_chlorine_01.ogg" : "https://media.vocaroo.com/mp3/1h7zxdcQYUwr",
        Cobblestone: S ? "/static/sound/bg_cobble_night_01.ogg" : "https://media.vocaroo.com/mp3/1dHrbnK9iE7i",
        Dust2: S ? "/static/sound/bg_dust2_01.ogg" : "https://media.vocaroo.com/mp3/1j0egXFKMgpS",
        Inferno: S ? "/static/sound/bg_inferno_01.ogg" : "https://media.vocaroo.com/mp3/1oQCEf1sb8he",
        Mirage: S ? "/static/sound/bg_mirage_01.ogg" : "https://media.vocaroo.com/mp3/1fOsr1iMrLIQ",
        Mutiny: S ? "/static/sound/bg_mutiny_01.ogg" : "https://media.vocaroo.com/mp3/1hrdrHLMATjH",
        Nuke: S ? "/static/sound/bg_nuke_01.ogg" : "https://media.vocaroo.com/mp3/103MpB3DLUGU",
        Overpass: S ? "/static/sound/bg_overpass_01.ogg" : "https://media.vocaroo.com/mp3/1oGyX2L67IYm",
        Phoenix: S ? "/static/sound/bg_phoenixfacility_01.ogg" : "https://media.vocaroo.com/mp3/1hyEIdR3Zo2q",
        Swamp: S ? "/static/sound/bg_swamp_01.ogg" : "https://media.vocaroo.com/mp3/1cnUL9yoAWSZ",
        Vertigo: S ? "/static/sound/bg_vertigo_01.ogg" : "https://media.vocaroo.com/mp3/1miO5hVNSeyX",
    },
};

export const PrimitiveAudioList = Object.values(AudioSource.Button);

export const buttonSounds = {
    onClick: () => play(AudioSource.Button.Click),
    onMouseEnter: () => play(AudioSource.Button.MouseOver),
};

export function playErrorSound() {
    play(AudioSource.Button.Quit);
}

export default AudioSource;
