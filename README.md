# CS:GO Notes
[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/Nojus0/csgonotes)

A CS:GO Themed Notes Web App with *AES256* Encryption.

![NukeHome](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/NukeHome.png)

[Website / Web App](https://csgonotes.netlify.app/)

# User Interface
You may already know from which game the user interface was imitated, I was trying to make the user interface look as similar to the CS:GO menu interface as possible.

# Setup
Start by creating a new key, a key is a file that contains the 2 values that are used to decrypt and encrypt the notes file.
Create a key by pressing the *New Key* button and preferably storing it on a USB or in another secure place.

You now can create a notes file. This is where your encrypted notes are stored. You can do so by pressing the *New List* button when you load your key.

Now you can add a new note by pressing the *Add* button, and name the notes file by changing the text in the textbox near the *Add* button,
after you add your notes save them by pressing the *Save* button.

# Disable Third Party Server Assets
If you don't want the Web App to be communicating with third party server's like _Voocaro_, _Imgur_, _Github_.

Change the `.env.local` file and set an environment variable `VITE_NO_THIRD_PARTY_SERVER_MODE=true` and build the project, be sure to test it in
chrome dev-tools network tab!

# Future Improvements
Make the web app a PWA.

# Shortcuts
*M* Mute audio

*N* Next scene

*B* Previous scene

*CTRL + C* Serialize the list and the keypair into a shareable link.

# Notes
This GitHub Repo was cleaned using _bfg_ to reduce repository size from 200MB to 73MB

Sound and Video Assets are not included before this [Commit](https://github.com/Nojus0/csgonotes/commit/c18df23fbeb08406bb3458485c0f9a15b16e5d61)

# Images
![NukeList](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/NukeList.png)
![NukeRestore](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/NukeRestore.png)
![NukeCopyToClipboard](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/NukeCopyToClipboard.png)
![Sirocco](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/SiroccoHome.png)
![Aztec](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/AztecHome.png)
![Apollo](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/ApolloHome.png)
![Swamp](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/SwampHome.png)
![Blacksite](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/BlacksiteHome.png)
![Mutiny](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/MutinyHome.png)
![Cobblestone](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/CobbleHome.png)
![Anubis](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/AnubisHome.png)
![Vertigo](https://raw.githubusercontent.com/Nojus0/csgonotes/main/images/VertigoHome.png)
