import Ancient from "@Assets/video/ancient540.webm"
import Anubis from "@Assets/video/anubis540.webm"
import Apollo from "@Assets/video/apollo540.webm"
import Blacksite from "@Assets/video/blacksite540.webm"
import Cobblestone from "@Assets/video/cbble540.webm"
import County from "@Assets/video/county540.webm"
import Mutiny from "@Assets/video/mutiny540.webm"
import Nuke from "@Assets/video/nuke540.webm"
import Sirocco from "@Assets/video/sirocco_night540.webm"
import Swamp from "@Assets/video/swamp540.webm"
import Vertigo from "@Assets/video/vertigo540.webm"

export interface VideoSource {
  Nuke: string
  Vertigo: string
  Anubis: string
  Cobblestone: string
  Mutiny: string
  Blacksite: string
  Swamp: string
  Ancient: string
  Sirocco: string
  Apollo: string
  County: string
}

export const StaticVideoSource: VideoSource = {
  Nuke,
  Vertigo,
  Anubis,
  Cobblestone,
  Mutiny,
  Blacksite,
  Swamp,
  Ancient,
  Sirocco,
  Apollo,
  County,
}
