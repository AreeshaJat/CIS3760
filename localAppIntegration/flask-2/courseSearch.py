import json

def searchCourses(courses) :
    all_courses = []
    for x in courses :
        y = courseSearch(x)
        all_courses.append(y)
    return all_courses
  
def courseSearchFunction(userInput, fileName):

    # Load JSON file into memory
    with open(fileName, 'r') as f:
        courses = json.load(f)

    # ***IMPLEMENT SEARCH ALGO HERE***
    for x in courses:
        curr_course = courses[x]
        curr_course_courseName = curr_course['courseName']
        curr_course_courseName = curr_course_courseName.replace("*", "")
        # curr_course_courseName = curr_course_courseName.replace(" ", "")
        curr_course_courseName = curr_course_courseName.lower()

        userInput = userInput.replace("*", "")
        userInput = userInput.lower()

        if userInput in curr_course_courseName:
            courseDictionary = {"courseName": curr_course_courseName, "meetingInfo":curr_course['meetingInfo']}
            return courseDictionary

    return None

# if __name__ == "__main__":
#     courseSearch()
