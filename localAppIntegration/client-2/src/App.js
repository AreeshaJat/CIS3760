import React, { useState, useEffect } from "react";

function App () {

  let arrayForSearch = [];
  let coursesAlreadyIn = [];
  let coursesAlreadyInFULL = [];

  // Autofill Choices initialization
  let TTOffGlobal = false;
  let morOffGlobal = false;
  let corLevGlobal = false;

  // Gets entire JSON object from Fask
  const [term, setTerm] = useState("");
  const [data, setData] = useState([{}]);
  const [data2, setData2] = useState([{}]);

  const handleChange_sem = event => {
    setTerm(event.target.value);
    hideAutoMenu();
  };
  
  //Grabbing Fall File
  useEffect(() => {
    fetch("/api/members").then(
      res => res.json()
    ).then(
      data => {
          setData(data)
        }
    )
  }, [])

  //Grabbing Winter File
  useEffect(() => {
    fetch("/api/members-2").then(
      res => res.json()
    ).then(
      data2 => {
          setData2(data2)
        }
    )
  }, [])

  function clearEverything () {
    // Clear already addecd courses
    coursesAlreadyIn = [];

    // Clearing course input boxes
    document.getElementById("courseOne").value = "";
    document.getElementById("courseTwo").value = "";
    document.getElementById("courseThree").value = "";
    document.getElementById("courseFour").value = "";
    document.getElementById("courseFive").value = "";

    //Clearing previous schedule
    var schedule = document.getElementById("schedule");
    for (var i = 1, row; row = schedule.rows[i]; i++) {
      for (var j = 1, col; col = row.cells[j]; j++) {
        schedule.rows[i].cells[j].style.backgroundColor = "#FFFFFF90";
        schedule.rows[i].cells[j].innerHTML = "-";
        schedule.rows[i].cells[j].style.borderBottom = "1px solid #dddddd";
      }
    }
  }

  //Adding courses to array used in dropdown menu search
  function addCoursesToDropDown() {
    event.preventDefault();

    // Clear drop down menu
    arrayForSearch = [];

    // Reset Checkboxes
    document.getElementById("daysOff").checked = false;
    document.getElementById("morningOff").checked = false;
    document.getElementById("courseLevel").checked = false;
    document.getElementById("firstYear").checked = true;

    clearEverything();

    // If a term has been chosem, display course search
    if (term == "fall22" || term == "winter23") {
      document.getElementById("choiceInputsBox").style.visibility = "visible";

      let fileToLookIn = null;

      let courseName, meetingInfo;

      if (term == "fall22") {
        fileToLookIn = data;
      } else if (term == "winter23") {
        fileToLookIn = data2;
      }

      for (const key in fileToLookIn) {
        let courseCode = fileToLookIn[key];
        courseName = courseCode["courseName"];
        meetingInfo = courseCode["meetingInfo"];
        arrayForSearch.push(courseName + "<br><em>" + meetingInfo + "</em>");
      }

      autocomplete(document.getElementById("courseOne"), arrayForSearch);
      autocomplete(document.getElementById("courseTwo"), arrayForSearch);
      autocomplete(document.getElementById("courseThree"), arrayForSearch);
      autocomplete(document.getElementById("courseFour"), arrayForSearch);
      autocomplete(document.getElementById("courseFive"), arrayForSearch);
    }  }

  const displayCourses = event => {
    event.preventDefault();

    coursesAlreadyIn = [];

    //Clearing previous schedule
    var schedule = document.getElementById("schedule");
    for (var i = 1, row; row = schedule.rows[i]; i++) {
      for (var j = 1, col; col = row.cells[j]; j++) {
        schedule.rows[i].cells[j].style.backgroundColor = "#FFFFFF90";
        schedule.rows[i].cells[j].innerHTML = "-";
        schedule.rows[i].cells[j].style.borderBottom = "1px solid #dddddd";
      }
    }

    let course1 = document.getElementById("courseOne").value;
    let course2 = document.getElementById("courseTwo").value;
    let course3 = document.getElementById("courseThree").value;
    let course4 = document.getElementById("courseFour").value;
    let course5 = document.getElementById("courseFive").value;
    
    // Printing given courses
    console.log("Printing user input:");
    console.log(course1 + " " + course2 + " " + course3 + " " + course4 + " " + course5);

    let coursesCollected = [];

    if (term == "fall22") {
      coursesCollected.push(searchCourses(course1, data));
      coursesCollected.push(searchCourses(course2, data));
      coursesCollected.push(searchCourses(course3, data));
      coursesCollected.push(searchCourses(course4, data));
      coursesCollected.push(searchCourses(course5, data));
    }
    else if (term == "winter23") {
      coursesCollected.push(searchCourses(course1, data2));
      coursesCollected.push(searchCourses(course2, data2));
      coursesCollected.push(searchCourses(course3, data2));
      coursesCollected.push(searchCourses(course4, data2));
      coursesCollected.push(searchCourses(course5, data2));
    }

    console.log("Printing matching courses found:");
    console.log(coursesCollected);

    tokenizingMaster(coursesCollected);
};

  // Looks for matching courses in json file
  function searchCourses(course, data) {
    let courseCode, meetingInfo, courseName;
    let courseDictionary = null;
    let emptyDictionary = null;
    
    // If course is empty and autofill is touched
    if (course == "" && (TTOffGlobal || morOffGlobal || corLevGlobal)) {
      // fill out course information
      for (const key in data) {
        courseCode = data[key];
        courseName = courseCode["courseName"];
        meetingInfo = courseCode["meetingInfo"];

        let courseTracker = courseName.split("*")[0] + courseName.split("*")[1];

        
        // Checking that the course has not already been added
        if (coursesAlreadyIn.includes(courseTracker)  == false) {
          // Groups of checkboxes
          if (Boolean(TTOffGlobal) && Boolean(morOffGlobal) && Boolean(corLevGlobal)) {
            if (!(meetingInfo.includes("Tues") || meetingInfo.includes("Thur"))) {
              if (!(meetingInfo.includes("08:00AM") || meetingInfo.includes("08:30AM") || meetingInfo.includes("09:00AM") || meetingInfo.includes("09:30AM"))) {
                courseDictionary = courseLevelSelected(meetingInfo, courseName, courseTracker, coursesAlreadyIn, emptyDictionary);
                if (courseDictionary != null) {
                  break;
                }
              }
            }
          } else if (Boolean(TTOffGlobal) && Boolean(morOffGlobal)) {
            if (!(meetingInfo.includes("Tues") || meetingInfo.includes("Thur"))) {
              if (!(meetingInfo.includes("08:00AM") || meetingInfo.includes("08:30AM") || meetingInfo.includes("09:00AM") || meetingInfo.includes("09:30AM"))) {
                coursesAlreadyIn.push(courseTracker);
                coursesAlreadyInFULL.push(courseName);
                courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
                break;
              }
            }
          } else if (Boolean(TTOffGlobal) && Boolean(corLevGlobal)) {
            if (!(meetingInfo.includes("Tues") || meetingInfo.includes("Thur"))) {
              courseDictionary = courseLevelSelected(meetingInfo, courseName, courseTracker, coursesAlreadyIn, emptyDictionary);
              if (courseDictionary != null) {
                break;
              }
            }
          } else if (Boolean(morOffGlobal) && Boolean(corLevGlobal)) {
            if (!(meetingInfo.includes("08:00AM") || meetingInfo.includes("08:30AM") || meetingInfo.includes("09:00AM") || meetingInfo.includes("09:30AM"))) {
              courseDictionary = courseLevelSelected(meetingInfo, courseName, courseTracker, coursesAlreadyIn, emptyDictionary);
              if (courseDictionary != null) {
                break;
              }
            }
          } else if (Boolean(TTOffGlobal)) {
            if (!(meetingInfo.includes("Tues") || meetingInfo.includes("Thur"))) {
              coursesAlreadyIn.push(courseTracker);
              coursesAlreadyInFULL.push(courseName);
              courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
              break;
            }
          } else if (Boolean(morOffGlobal)) {
            if (!(meetingInfo.includes("08:00AM") || meetingInfo.includes("08:30AM") || meetingInfo.includes("09:00AM") || meetingInfo.includes("09:30AM"))) {
              coursesAlreadyIn.push(courseTracker);
              coursesAlreadyInFULL.push(courseName);
              courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
              break;
            }
          } else if (Boolean(corLevGlobal)) {
            courseDictionary = courseLevelSelected(meetingInfo, courseName, courseTracker, coursesAlreadyIn, emptyDictionary);
            if (courseDictionary != null) {
              break;
            }
            
        }
      }
    }
    } else if (course == "") {
      return courseDictionary;
    } else {
      for (const key in data) {
        courseCode = data[key];
        courseName = courseCode["courseName"];
        meetingInfo = courseCode["meetingInfo"];

        let courseTracker = courseName.split("*")[0] + courseName.split("*")[1];
        
        // Checking that the course has not already been added
        if (coursesAlreadyIn.includes(courseTracker) == false) {
          if (courseName.includes(course)) {
            coursesAlreadyIn.push(courseTracker);
            coursesAlreadyInFULL.push(courseName);
            courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
            break;
          }
        }
      }
    }

    return courseDictionary;
  };

  function courseLevelSelected (meetingInfo, courseName, courseTracker, coursesAlreadyIn, courseDictionary) {
      let yearOne = document.getElementById("firstYear");
      let yearTwo = document.getElementById("secondYear");
      let yearThree = document.getElementById("thirdYear");
      let yearFour = document.getElementById("fourthYear");

      if (yearOne.checked) {
        let curCourseCode = courseName.split("*");
        if (curCourseCode[1][0] == "1") {
          coursesAlreadyIn.push(courseTracker);
          coursesAlreadyInFULL.push(courseName);
          courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
        }
      }
      else if (yearTwo.checked) {
        let curCourseCode = courseName.split("*");
        if (curCourseCode[1][0] == "2") {
          coursesAlreadyIn.push(courseTracker);
          coursesAlreadyInFULL.push(courseName);
          courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
        }
      }
      else if (yearThree.checked) {
        let curCourseCode = courseName.split("*");
        if (curCourseCode[1][0] == "3") {
          coursesAlreadyIn.push(courseTracker);
          coursesAlreadyInFULL.push(courseName);
          courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
        }
      }
      else if (yearFour.checked) {
        let curCourseCode = courseName.split("*");
        if (curCourseCode[1][0] == "4") {
          coursesAlreadyIn.push(courseTracker);
          coursesAlreadyInFULL.push(courseName);
          courseDictionary = {"courseName": courseName, "meetingInfo": meetingInfo};
        }
      }
      return courseDictionary;
  }

  function tokenizingMaster(coursesCollected) {
    let courseInfo, indexLec = -1, indexSem, indexLab, indexExam, lecture = "", lab = "", sem = "", exam = "";;
    for (const x in coursesCollected) {
      lecture = ""; 
      lab = "";
      sem = "";
      exam = "";

      if (coursesCollected[x] != null) {
        if ((coursesCollected[x]).meetingInfo != undefined) {
          courseInfo = (coursesCollected[x]).meetingInfo;
          indexLec = courseInfo.indexOf("LEC");
          indexSem = courseInfo.indexOf("SEM");
          indexLab = courseInfo.indexOf("LAB");
          indexExam = courseInfo.indexOf("EXAM");
        }
      } else {
        break;
      }

      if (indexLec >= 0) {
        if (indexSem >= 0) {
          lecture = courseInfo.substring(indexLec, indexSem);
        } else if (indexLab >= 0) {
          lecture = courseInfo.substring(indexLec, indexLab);
        } else if (indexExam >= 0) {
          lecture = courseInfo.substring(indexLec, indexExam);
        } else {
          lecture = courseInfo.substring(indexLec);
        }
      }

      if (indexSem >= 0) {
        if (indexLab >= 0) {
          sem = courseInfo.substring(indexSem, indexLab);
        } else if (indexExam >= 0) {
          sem = courseInfo.substring(indexSem, indexExam);
        } else {
          sem = courseInfo.substring(indexSem);
        }
      }

      if (indexLab >= 0) {
        if (indexExam >= 0) {
          lab = courseInfo.substring(indexLab, indexExam);
        } else {
          lab = courseInfo.substring(indexLab);
        }
      }

      if (indexExam >= 0){
        exam = courseInfo.substring(indexExam);
      }
      
      let listOfTimes = [lecture, sem, lab, exam];

      showCalendar(coursesCollected[x], listOfTimes);
    }
  }

  function showCalendar(course, listOfTimes) {
    console.log("Printing tokenized course information: ");

    for (const x in listOfTimes)
    {
      if(listOfTimes[x] != "" && listOfTimes[x] != null) {
        let tokenedMeeting = listOfTimes[x].split(" ");

        let meetingType = tokenedMeeting[0];
        let meetingDay = tokenedMeeting[1];
        let meetingDay2 = "", meetingDay3 = "", startTime = "", endTime = "", location = "";
        let temp = tokenedMeeting[2].substring(0, 3);

        if (temp == "Tue" || temp == "Wed" || temp == "Thu" || temp == "Fri") {
          meetingDay2 = tokenedMeeting[2];
          temp = tokenedMeeting[3].substring(0, 3);
          if (temp == "Tue" || temp == "Wed" || temp == "Thu" || temp == "Fri") {
            meetingDay3 = tokenedMeeting[3];

            //Setting meeting time and location based on three lectures
            startTime = tokenedMeeting[4];
            endTime = tokenedMeeting[6];

            if(meetingType.includes("EXAM")) {
              location = "TBA";
            } else {
              location = tokenedMeeting[7] + " " + tokenedMeeting[10];
            }

          }else {
            //Setting meeting time and location based on three lectures
            startTime = tokenedMeeting[3];
            endTime = tokenedMeeting[5];
            if(meetingType.includes("EXAM")) {
              location = "TBA";
            } else {
              location = tokenedMeeting[6]  + " " + tokenedMeeting[9];
            }
          }
        }else {
          startTime = tokenedMeeting[2];
          endTime = tokenedMeeting[4];
          if(meetingType.includes("EXAM")) {
            location = "TBA";
          } else {
            location = tokenedMeeting[5]  + " " + tokenedMeeting[8];
          }
        }

        let startHour = parseInt(startTime.substring(0,  2));
        let startMin = parseInt(startTime.substring(3, 5));

        let endHour = parseInt(endTime.substring(0, 2));
        let endMin = parseInt(endTime.substring(3, 5));

        if (startTime.substring(5, 7) == "PM") {
          if (startHour != 12) {
            startHour += 12;
          }
        }

        if (endTime.substring(5, 7) == "PM") {
          if (endHour != 12) {
            endHour += 12;
          }
        }

        if (endMin == 20) {
          endMin += 10;
        }

        if (endMin == 50) {
          endHour += 1;
          endMin = 0;
        }

        let startString = startHour + ":" + startMin;
        let endString = endHour + ":" + endMin;

        //Pritning out all the information that we have
        console.log("Course Name: " + course.courseName + " Type: " + meetingType + "; Day: " + meetingDay + "; Start Time: " + startHour + ":" + startMin + "; End Time: " + endHour + ":" + endMin);
        
        //Traversing the schedule
        var schedule = document.getElementById("schedule");
        let startVar, endVar, dayCol, dayCol2 = 0, dayCol3 = 0;

        //Finding starting time
        for (var i = 0, row; row = schedule.rows[i]; i++) {
          let compareString = row.cells[0].innerText;

          if (compareString.includes(startString)) {
            startVar = i;
          }
          else if (compareString.includes(endString)) {
            endVar = i;
            break;
          }
        }

        //Finding day
        row = schedule.rows[0]
        for (var j = 0, col; col = row.cells[j]; j++) {
          let compareString = row.cells[j].innerText;

          if (compareString.includes(meetingDay.substring(0, 3))) {
            dayCol = j;
          } else if (meetingDay2 != "" && compareString.includes(meetingDay2.substring(0, 3))) {
            dayCol2 = j;
          } else if (meetingDay3 != "" && compareString.includes(meetingDay3.substring(0, 3))) {
            dayCol3 = j;
          }
        }

        // let beforeString = "";

        // //Adding previous course information if available
        // if (schedule.rows[startVar] != null && schedule.rows[startVar].cells[dayCol].innerHTML != "-") {
        //   beforeString = schedule.rows[startVar].cells[dayCol].innerHTML + "<br><br>";
        // }

        for (let i = startVar; i < endVar; i++) {
          let beforeString = "";

          //Adding previous course information if available
          if (schedule.rows[i] != null && schedule.rows[i].cells[dayCol].innerHTML != "-") {
            beforeString = schedule.rows[i].cells[dayCol].innerHTML + "<br><br>";
          }
          
          let colourToSet = "", colourToSet2 = "", colourToSet3 = "";

          // Colour based on meeting type - SETTING BACKGROUND
          if (meetingType.includes("LEC")) {
            schedule.rows[i].cells[dayCol].style.backgroundColor = "#4052AB";
            colourToSet = "#4052AB";
            if(dayCol2 != 0) {
              schedule.rows[i].cells[dayCol2].style.backgroundColor = "#4052AB";
              colourToSet2 = "#4052AB";
            }
            if(dayCol3 != 0) {
              schedule.rows[i].cells[dayCol3].style.backgroundColor = "#4052AB";
              colourToSet3 = "#4052AB";
            }
          }
          else if (meetingType.includes("LAB")) {
            schedule.rows[i].cells[dayCol].style.backgroundColor = "#407855";
            colourToSet = "#407855";
          }
          else if (meetingType.includes("SEM")) {
            schedule.rows[i].cells[dayCol].style.backgroundColor = "#854085";
            colourToSet = "#854085";
          }
          else if (meetingType.includes("EXAM")) {
            schedule.rows[i].cells[dayCol].style.backgroundColor = "#DA612e ";
            colourToSet = "#DA612e";
          }

          // Colouring it red if something already exists
          if(schedule.rows[i].cells[dayCol].innerHTML != "-") {
            // beforeString = schedule.rows[i].cells[dayCol].innerHTML + "<br><br>";
            schedule.rows[i].cells[dayCol].style.backgroundColor = "#a80000";
            schedule.rows[i].cells[dayCol].style.fontWeight = "bold";
            colourToSet = "#a80000";
          }
          if(dayCol2 != 0 && schedule.rows[i].cells[dayCol2].innerHTML != "-") {
            schedule.rows[i].cells[dayCol2].style.backgroundColor = "#a80000";
            schedule.rows[i].cells[dayCol2].style.fontWeight = "bold";
            colourToSet2 = "#a80000";
          }
          if(dayCol3 != 0 && schedule.rows[i].cells[dayCol3].innerHTML != "-") {
            schedule.rows[i].cells[dayCol3].style.backgroundColor = "#a80000";
            schedule.rows[i].cells[dayCol3].style.fontWeight = "bold";
            colourToSet3 = "#a80000";
          }
          
          if (i == startVar) {
            schedule.rows[i].cells[dayCol].innerHTML = beforeString + course.courseName + "<br>" + meetingType + "<br>" + location;
            schedule.rows[i].cells[dayCol].style.borderBottom = "1px solid " + colourToSet;
            if(dayCol2 != 0) {
              schedule.rows[i].cells[dayCol2].innerHTML = beforeString + course.courseName + "<br>" + meetingType + "<br>" + location;
              schedule.rows[i].cells[dayCol2].style.borderBottom = "1px solid " + colourToSet2;
            }
            if(dayCol3 != 0) {
              schedule.rows[i].cells[dayCol3].innerHTML = beforeString + course.courseName + "<br>" + meetingType + "<br>" + location;
              schedule.rows[i].cells[dayCol3].style.borderBottom = "1px solid " + colourToSet3;
            }
          }
          else if (i == endVar - 1) {
            schedule.rows[i].cells[dayCol].innerHTML = beforeString;
            if(dayCol2 != 0) {
              schedule.rows[i].cells[dayCol2].innerHTML = beforeString;
            }
            if(dayCol3 != 0) {
              schedule.rows[i].cells[dayCol3].innerHTML = beforeString;
            }
          }
          else {
            schedule.rows[i].cells[dayCol].innerHTML = beforeString;
            schedule.rows[i].cells[dayCol].style.borderBottom = "1px solid " + colourToSet;
            if(dayCol2 != 0) {
              schedule.rows[i].cells[dayCol2].innerHTML = beforeString;
              schedule.rows[i].cells[dayCol2].style.borderBottom = "1px solid " + colourToSet2;
            }
            if(dayCol3 != 0) {
              schedule.rows[i].cells[dayCol3].innerHTML = beforeString;
              schedule.rows[i].cells[dayCol3].style.borderBottom = "1px solid " + colourToSet3;
            }
          }
        }
      }
    }

    document.getElementById("courseOne").value = coursesAlreadyInFULL[0];
    document.getElementById("courseTwo").value = coursesAlreadyInFULL[1];
    document.getElementById("courseThree").value = coursesAlreadyInFULL[2];
    document.getElementById("courseFour").value = coursesAlreadyInFULL[3];
    document.getElementById("courseFive").value = coursesAlreadyInFULL[4];

  }

  // Autocomplete searching functionality
  // Source: https://www.w3schools.com/howto/howto_js_autocomplete.asp
  function autocomplete(inp, arr) {
    let inputID = inp;
    var manElem;
    var currentFocus;
    let courseCode;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                  inp.value = this.getElementsByTagName("input")[0].value;
                  manElem = document.getElementById(inp.name);
                  courseCode = (inp.value).split("<");                  
                  manElem.setAttribute("value", courseCode[0]);

                  inp.value = courseCode[0];

                  closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

  // Deals with autofill choices selected
  function handleChange_choice () {
    event.preventDefault();

    clearEverything();

    let TTOff = document.getElementById("daysOff");
    let morOff = document.getElementById("morningOff");
    let corLev = document.getElementById("courseLevel");

    if (TTOff.checked) {
      TTOffGlobal = true;
    } else {
      TTOffGlobal = false;
    }

    if (morOff.checked) {
      morOffGlobal = true;
    } else {
      morOffGlobal = false;
    }

    if (corLev.checked) {
      corLevGlobal = true;
    } else {
      corLevGlobal = false;
    }

    document.getElementById("courseInputsBox").style.visibility = "visible";
  }

  // Show years if autocomplete option is selection
  function showYears () {
    let corLev = document.getElementById("courseLevel");
    hideCourseWindow();

    if (corLev.checked) {
      document.getElementById("yearsSelection").style.visibility = "visible";
    } else {
      document.getElementById("yearsSelection").style.visibility = "hidden";
    }
  }

  // Shows course selection window if either of the checkboxes are changed
  function hideCourseWindow () {
    clearEverything();
    document.getElementById("courseInputsBox").style.visibility = "hidden";
  }

  function hideAutoMenu () {
    hideCourseWindow();
    document.getElementById("choiceInputsBox").style.visibility = "hidden";
    document.getElementById("yearsSelection").style.visibility = "hidden";
  }

  // Returning Term and Course input functionality
  return (
        <div className="hereToFlex">
          {/* Semester Input */}
          <div className="semInputs">
              <form className="semInputForm" onSubmit={addCoursesToDropDown}>
                <select className="termSelect" name="terms" id="terms" onChange={handleChange_sem}>
                  <option selected="true" disabled="disabled">Select A Term</option>
                  <option value="fall22">Fall 2022</option>
                  <option value="winter23">Winter 2023</option>
                </select>
                <br></br>
                <input className="semSubmitButton" type="submit" value="Next"></input>
              </form>
          </div>
          {/* Autofill Input */}
          <div style={{visibility: "hidden"}} id="choiceInputsBox" className="choiceInputs">
              <form className="choiceInputForm" onSubmit={handleChange_choice}>
                <h4>Autofill Options</h4>
                <p>Click The <strong>Next</strong> Button For No Autofill</p>

                <div className="choiceInputButtons"><input type="checkbox" id="daysOff" name="daysOff" value="daysOff" onChange={hideCourseWindow}></input>
                <label className="choiceInputFields" htmlFor="daysOff"> Tuesday and Thursday Off</label></div>
                
                <div className="choiceInputButtons"><input type="checkbox" id="morningOff" name="morningOff" value="morningOff" onChange={hideCourseWindow}></input>
                <label className="choiceInputFields" htmlFor="morningOff"> No Classes Before 10:00AM</label></div>
                
                <div className="choiceInputButtons"><input type="checkbox" id="courseLevel" name="courseLevel" value="courseLevel" onChange={showYears}></input>
                <label className="choiceInputFields" htmlFor="courseLevel"> Based On Course Level</label></div>
                
                {/* Year Input */}
                <form style={{visibility: "hidden"}} className="choiceInputRadio" id="yearsSelection" onChange={hideCourseWindow}>
                  <label className="choiceInputFields" htmlFor="firstYear">1</label>
                  <input type="radio" id="firstYear" name="courseYear" value="firstYear" checked></input>
                  
                  <label className="choiceInputFields" htmlFor="secondYear">2</label>
                  <input type="radio" id="secondYear" name="courseYear" value="secondYear"></input>
                  
                  <label className="choiceInputFields" htmlFor="thirdYear">3</label>
                  <input type="radio" id="thirdYear" name="courseYear" value="thirdYear"></input>

                  <label className="choiceInputFields" htmlFor="fourthYear">4</label>
                  <input type="radio" id="fourthYear" name="courseYear" value="fourthYear"></input>
                </form>
                <input className="semSubmitButton" type="submit" value="Next"></input>
              </form>
          </div>
          <div style={{visibility: "hidden"}} id="courseInputsBox" className="courseInputs">
            <form autoComplete="off" className="inputForm" onSubmit={displayCourses}>
              <label className="courseInputFields" htmlFor="courseOne">Course One: </label>
              <div className="autocomplete"><input className="courseAutoFill" type="text" id="courseOne" name="courseOne"></input></div>
              <br></br>
              
              <label className="courseInputFields" htmlFor="courseTwo">Course Two: </label>
              <div className="autocomplete"><input className="courseAutoFill" type="text" id="courseTwo" name="courseTwo"></input></div>
              <br></br>

              <label className="courseInputFields" htmlFor="courseThree">Course Three: </label>
              <div className="autocomplete"><input className="courseAutoFill"type="text" id="courseThree" name="courseThree"></input></div>
              <br></br>

              <label className="courseInputFields" htmlFor="courseFour">Course Four: </label>
              <div className="autocomplete"><input className="courseAutoFill"type="text" id="courseFour" name="courseFour"></input></div>
              <br></br>

              <label className="courseInputFields" htmlFor="courseFive">Course Five: </label>
              <div className="autocomplete"><input className="courseAutoFill"type="text" id="courseFive" name="courseFive"></input></div>
              <br></br>
              
              <input className="submitButton" type="submit" value="Submit"></input>
            </form>
          </div>
        </div>
  );
};

export default App;
