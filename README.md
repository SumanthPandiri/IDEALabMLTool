# IDEALabMLTool
Teach your own machine learning model! 
Click the Datacenter button and create classes. Take images or upload them from your computer. Train using the train button, and then and test your model using your live camera! 

This website was built using Svelte, JavaScript, Tensorflow.JS, and Tailwind.CSS. 

Developed By Sumanth Pandiri, IDEA Lab (formerly Clemson University, now Vanderbilt University).


## Building, Running, and Testing Locally

To run this application locally, you will need to have the following installed on your machine:

- Node and NPM
    - [How to install NodeJS and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Git
    - [How to install Git](https://github.com/git-guides/install-git)



### Cloning the repository
Once Git is installed, you can clone this repository on your machine.

Using the Terminal or Command Prompt, navigate to the desired directory where you would like to clone the repository. Run the following command:

```git clone https://github.com/IDEA-Lab-Clemson-University/IDEALabMLTool```

This will create a new folder in your current working directory called `IDEALabMLTool`. Navigate into it by running `cd IDEALabMLTool`

### Installing proper dependencies

Once in the `IDEALabMLTool` directory AND Node and npm are installed, run `npm install` to install the required dependencies. This may take a while if it is the first time running. 

### Running the application

Once you have installed the dependencies, you can run `npm run dev` to start the development server. You should receive a message in the terminal once the server is up and running. You can then navigate to [http://localhost:5173](http://localhost:5173) in your browser to access the application.

When you are ready to close the application, you can `CTRL+C` in the terminal to stop the server. You can also just close the terminal window. 


## Contributing

Those who wish to contribute to this project can do so in multiple ways

### Issue Reporting
If you spot an issue while using/demoing the application, please create a new [GitHub Issue](https://github.com/IDEA-Lab-Clemson-University/IDEALabMLTool/issues) describing the problem, where it was found, and what the expected behavior should be.

### Pull Requests
If you want to contribute code to this repository, please create a fork and branch from the development branch and submit a pull request.

To keep contributions clear, it is recommended to install [psioniq File Header](https://marketplace.visualstudio.com/items?itemName=psioniq.psi-header) as an extension to VSCode. This will automatically add a comment to the top of any file you create with relevant information about the contributor. You should then go into `/.vscode/settings.json` and configure the `psi-header.config` object to represent your name, email and affiliation. 

## Project Structure

### Folder Structure
The main application lives in the `src` directory.