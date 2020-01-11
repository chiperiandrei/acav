#### Setting SCSS file watcher in Web Storm or PHP Storm 

1. Go to `File` > `Settings` > `Tools` > `File Watcher`.

2. Hit the **`+`** button and select `SCSS`.

3. Now set the file watcher like this:
   - At `Program:` label add your path to `sass.cmd`.
   <br>Mine looks like:
     
       ```
       C:\Users\{YOUR_USERNAME}\AppData\Roaming\npm\sass.cmd
       ```
   
   - At `Arguments:` add the following line:
    
       ```
       --update $FileName$:$ProjectFileDir$\web-application\src\public\css\$FileNameWithoutExtension$.css
       ```
   
   - At `Output paths to refresh:` add line:
   
       ```
       $ProjectFileDir$\web-application\src\public\css\$FileNameWithoutExtension$.css
       ```
     
   - At `Working directory` add:
   
       ```
       $ProjectFileDir$\web-application\src\public\scss\core
       ```
     
<br>*Warning*: this settings work only if you open `Microservices` as Project (otherwise paths should be changed).
       
4. Check if `SCSS` file watcher is enabled (checkbox is active).

5. Click Apply and then OK.