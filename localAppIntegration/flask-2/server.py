# This is the backend

from flask import Flask, request, redirect, render_template, jsonify, session, url_for
import json, courseSearch

app = Flask(__name__)

@app.route("/api/members")
def members() :
    with open('coursesFall.json', 'r') as f:
        coursesBasic = json.loads(f.read())
        coursesJSON = json.dumps(coursesBasic)
    return coursesJSON

@app.route("/api/members-2")
def members2() :
    with open('coursesWinter.json', 'r') as f:
        coursesBasic2 = json.loads(f.read())
        coursesJSON2 = json.dumps(coursesBasic2)
    return coursesJSON2

if __name__ == "__main__":
    app.run(debug=True)
