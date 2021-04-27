## CIS-550-Final-Project

# Installation 

1. Make sure you have Node installed : Open a terminal and type ```node -v; npm -v``` to check what version, if any, of node and npm are installed on your machine. If these commands are not recognized, go to https://nodejs.org/en/download/ and download the Node.js for your system. Having multiple versions sometimes causes issues that are hard to debug.

2. Download and unzip CIS-550-Final-Project

3. In a terminal, cd into the ```CIS-550-Final-Project/client``` directory.

4. Next type ```npm install``` in the terminal. This will download all the required client-side dependencies, which are specified in package.json into the node_modules/ directory.
 
5. In the same terminal, cd into the ```CIS-550-Final-Project/server``` directory.

6. Type ```npm install```. This will download all required server-side dependencies.

# Usage 

1. While in the /server folder, type ```npm start``` in the terminal to begin the back-end app. By default, it’s running on port 8081. You should see a message in the Terminal saying ```Server listening on PORT 8081```.  

2. In a separate terminal under the project directory, type ```cd client```. Next type ```npm start``` to begin the React app. This will start the client-side code. Your browser should automatically open to http://localhost:3000. If not, enter this link manually. 

3. If your setup was successful, you should see the Home page。 
 


