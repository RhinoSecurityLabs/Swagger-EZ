# Swagger-EZ
A tool geared towards pentesting APIs using OpenAPI definitions.

We have a version hosted here:

##Setup
`git clone https://github.com/RhinoSecurityLabs/Swagger-EZ.git`

Open `index.html` in your browser.


##Usage
Once the UI is loaded into the browser, I suggest presser F12 to have the browser console open to watch for potential errors.

Configure your browser to use the proxy tool you would like i.e. Burp Suite.

Now you can insert the URL containing the Swagger 2.0 JSON or simply copy and paste an entire JSON Swagger 2.0 blob into the input field. 

Pressing load will parse the JSON and load the input fields for the parameters that need to be filled out.

Fill out each parameters with some data and when ready press send.

You should see the site tree of your proxy filling up.