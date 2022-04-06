# Encrypted Todo List
A Web app that allows you to store todos securely using AES256 encryption.

# User Interface
You may already know from which game the user interface was imitated, I was trying to make the user interface look as similar to the CS:GO menu interface as possible.

# Setup
You start by creating a key pair that contains a key, IV, and the version of the key pair.
You can do so by pressing the *New Keypair* button and preferably storing it on a USB or in another secure place.

You now need to create the list file. This is where your encrypted todos are stored. You can do so by pressing the *New List* button when you load your keypair.

Now your todo list is set up, you now can add a new todo by pressing the *Add* button and rename the list by changing the text in the textbox near the *Add* button,
after you add your todos save them by pressing the *Save* button and overwriting the original list file or saving it as a new file.

# Possible QOL Improvements
You may have already noticed that when you create a new key pair or a list, you need to load it manually after you create it, so after you create them, they are not automatically loaded.

The second possible improvement is to give Chrome permission to access the key pair and list file so you don't have to load them every time you need to add a new todo.