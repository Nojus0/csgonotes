// Improve this and AudioSource files, make them cleaner

export interface AudioSource {
  Button: {
    Click: string;
    MouseOver: string;
    Quit: string;
  },
  Ambience: {
    Anubis: string;
    Blacksite: string;
    Chlorine: string;
    Cobblestone: string;
    Dust2: string;
    Inferno: string;
    Mirage: string;
    Mutiny: string;
    Nuke: string;
    Overpass: string;
    Phoenix: string;
    Swamp: string;
    Vertigo: string;
  }
}

export const StaticAudioSource: AudioSource = {
  Button: {
    Click: "/static/sound/generic_press_01.wav",
    MouseOver: "/static/sound/itemtile_rollover_09.wav",
    Quit: "/static/sound/mainmenu_press_quit_02.wav"
  },
  Ambience: {
    Anubis:
      "/static/sound/bg_anubis_01.ogg",
    Blacksite: "/static/sound/bg_blacksite_01.ogg",
    Chlorine: "/static/sound/bg_chlorine_01.ogg",
    Cobblestone: "/static/sound/bg_cobble_night_01.ogg",
    Dust2: "/static/sound/bg_dust2_01.ogg",
    Inferno: "/static/sound/bg_inferno_01.ogg",
    Mirage: "/static/sound/bg_mirage_01.ogg",
    Mutiny: "/static/sound/bg_mutiny_01.ogg",
    Nuke: "/static/sound/bg_nuke_01.ogg",
    Overpass: "/static/sound/bg_overpass_01.ogg",
    Phoenix: "/static/sound/bg_phoenixfacility_01.ogg",
    Swamp: "/static/sound/bg_swamp_01.ogg",
    Vertigo: "/static/sound/bg_vertigo_01.ogg",
  },
}

export const ThirdPartyAudioSource: AudioSource = {
  Button: {
    Click: "https://media.vocaroo.com/mp3/1mvXUebjUbYo",
    MouseOver: "https://media.vocaroo.com/mp3/1dAHcxcXWPMz",
    Quit: "https://media.vocaroo.com/mp3/1cya9hq3V6n8",
  },
  Ambience: {
    Anubis: "https://media.vocaroo.com/mp3/11WObh4EkZWH",
    Blacksite: "https://media.vocaroo.com/mp3/1lhrFS62sHBN",
    Chlorine: "https://media.vocaroo.com/mp3/1h7zxdcQYUwr",
    Cobblestone: "https://media.vocaroo.com/mp3/1dHrbnK9iE7i",
    Dust2: "https://media.vocaroo.com/mp3/1j0egXFKMgpS",
    Inferno: "https://media.vocaroo.com/mp3/1oQCEf1sb8he",
    Mirage: "https://media.vocaroo.com/mp3/1fOsr1iMrLIQ",
    Mutiny: "https://media.vocaroo.com/mp3/1hrdrHLMATjH",
    Nuke: "https://media.vocaroo.com/mp3/103MpB3DLUGU",
    Overpass: "https://media.vocaroo.com/mp3/1oGyX2L67IYm",
    Phoenix: "https://media.vocaroo.com/mp3/1hyEIdR3Zo2q",
    Swamp: "https://media.vocaroo.com/mp3/1cnUL9yoAWSZ",
    Vertigo: "https://media.vocaroo.com/mp3/1miO5hVNSeyX",
  },
}
