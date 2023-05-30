import Anubis from "@Assets/audio/bg_anubis_01.ogg"
import Blacksite from "@Assets/audio/bg_blacksite_01.ogg"
import Chlorine from "@Assets/audio/bg_chlorine_01.ogg"
import Cobblestone from "@Assets/audio/bg_cobble_night_01.ogg"
import Dust2 from "@Assets/audio/bg_dust2_01.ogg"
import Inferno from "@Assets/audio/bg_inferno_01.ogg"
import Mirage from "@Assets/audio/bg_mirage_01.ogg"
import Mutiny from "@Assets/audio/bg_mutiny_01.ogg"
import Nuke from "@Assets/audio/bg_nuke_01.ogg"
import Overpass from "@Assets/audio/bg_overpass_01.ogg"
import Phoenix from "@Assets/audio/bg_phoenixfacility_01.ogg"
import Swamp from "@Assets/audio/bg_swamp_01.ogg"
import Vertigo from "@Assets/audio/bg_vertigo_01.ogg"
import ButtonClick from "@Assets/audio/generic_press_01.mp3"
import ItemTileRollover from "@Assets/audio/itemtile_rollover_09.mp3"
import MainMenuPressQuit from "@Assets/audio/mainmenu_press_quit_02.mp3"

export interface AudioSource {
  Button: {
    Click: string
    MouseOver: string
    Quit: string
  }
  Ambience: {
    Anubis: string
    Blacksite: string
    Chlorine: string
    Cobblestone: string
    Dust2: string
    Inferno: string
    Mirage: string
    Mutiny: string
    Nuke: string
    Overpass: string
    Phoenix: string
    Swamp: string
    Vertigo: string
  }
}

export const StaticAudioSource: AudioSource = {
  Button: {
    Click: ButtonClick,
    MouseOver: ItemTileRollover,
    Quit: MainMenuPressQuit,
  },
  Ambience: {
    Anubis: Anubis,
    Blacksite: Blacksite,
    Chlorine: Chlorine,
    Cobblestone: Cobblestone,
    Dust2: Dust2,
    Inferno: Inferno,
    Mirage: Mirage,
    Mutiny: Mutiny,
    Nuke: Nuke,
    Overpass: Overpass,
    Phoenix: Phoenix,
    Swamp: Swamp,
    Vertigo: Vertigo,
  },
}
