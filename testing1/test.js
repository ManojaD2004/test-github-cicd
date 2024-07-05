const { exec } = require("child_process");

let resArray = [];
setInterval(() => {
  exec(
    `cd test-github-cicd && git fetch origin && git log --all  --pretty=format:'{%n  "commit": "%H",%n  "author": "%aN <%aE>",%n  "date": "%ad",%n  "message": "%f"%n},'$@ |
    perl -pe 'BEGIN{print "["}; END{print "]\n"}' | perl -pe 's/},]/}]/'`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        // node couldn't execute the command
        return;
      }

      // the *entire* stdout and stderr (buffered)
      const res = JSON.parse(stdout);
      const resArray1 = res.map((ele) => ele.commit);
      let n = resArray1.length;
      if (resArray.length == 0) {
        resArray = resArray1;
        n = 0;
      } else {
        for (let index = 0; index < resArray1.length; index++) {
          if (resArray.includes(resArray1[index])) {
            n = n - 1;
          }
        }
      }
      if (n == 0) {
        console.log("Good");
        console.log(resArray);
      } else {
        console.log("Bad");
        resArray = resArray1;
        exec(
          "cd test-github-cicd && git pull origin main",
          (err, stdout, stderr) => {
            if (err) {
              console.log(err);
              // node couldn't execute the command
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          }
        );
      }
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
    }
  );
}, 10000);
