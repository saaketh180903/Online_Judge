import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Modal } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProblemPage = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [language, setLanguage] = useState('cpp'); // Default language is 'cpp'
  const [code, setCode] = useState(`#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Problem/${pid}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [pid]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/ProblemSubmission',
        {
          title: problem.title,
          code,
          language,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log('Problem solution submitted:', response.data.submission);
      setSubmission(response.data.submission);
      setShowModal(true); // Show the modal when submission is received
    } catch (error) {
      console.error('Error submitting problem solution:', error);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAllSubmissions = () => {
    navigate(`/submissions?problemTitle=${encodeURIComponent(problem.title)}`);
  };

  const handleMySubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/mys',
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('t1');
      console.log(response.data);
      const userEmail = response.data;
      if (userEmail == null) {
        toast.error('Please log in to view your submissions.'); // Display error notification
      } else {
        navigate(
          `/submissions?problemTitle=${encodeURIComponent(
            problem.title
          )}&userEmail=${encodeURIComponent(userEmail)}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Please log in to view your submissions.'); // Display error notification
      } else {
        console.error('Error retrieving user email:', error);
      }
    }
  };

  return (
    <div>
      {problem ? (
        <Card>
          <Card.Header>
            <h1>{problem.title}</h1>
            <Button variant="secondary" onClick={handleAllSubmissions}>All Submissions</Button>
            <Button variant="secondary" onClick={handleMySubmissions}>My Submissions</Button>
          </Card.Header>
          <Card.Body>
            <Card.Text>{problem.description}</Card.Text>
            <Card.Title>Example Input:</Card.Title>
            <Card.Text><pre>{problem.testCases[0].input}</pre></Card.Text>
            <Card.Title>Example Output:</Card.Title>
            <Card.Text><pre>{problem.testCases[0].expectedOutput}</pre></Card.Text>
            <form onSubmit={handleSubmit}>
              <div className="form-group" controlId="inputArray">
                <label>Input Array:</label>
                <input className="form-control" type="text" />
              </div>
              <div className="form-group" controlId="target">
                <label>Target:</label>
                <input className="form-control" type="text" />
              </div>
              <div className="form-group" controlId="code">
                <label>Code:</label>
                <AceEditor
                  mode="c_cpp"
                  theme="monokai"
                  value={code}
                  onChange={(value) => setCode(value)}
                  fontSize={14}
                  width="100%"
                  height="300px"
                />
              </div>
              <div className="form-group" controlId="language">
                <label>Language:</label>
                <select
                  className="form-control"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="secondary" type="button">
                Run
              </Button>
            </form>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading problem...</p>
      )}

      {submission && (
        <div>
          <h2>Submission Result</h2>
          <p>User: {submission.username}</p>
          <p>Title: {submission.title}</p>
          <p>
            Code Link: <pre>{submission.codelink}</pre>
          </p>
          <p>Verdict: {submission.verdict}</p>
          <p>DateTime: {submission.dateTime}</p>

          <Button variant="primary" onClick={() => setShowModal(true)}>View Result</Button>

          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Submission Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>User: {submission.username}</p>
              <p>Title: {submission.title}</p>
              <p>
                Code Link: <pre>{submission.codelink}</pre>
              </p>

              <h3>Test Results:</h3>
              <ul>
                {submission.tests.map((test, index) => (
                  <li key={index}>
                    <strong>Test {index + 1}:</strong>
                    <ul>
                      <li>Input: <pre>{test.input}</pre></li>
                      <li>Generated Output: <pre>{test.generatedOutput}</pre></li>
                      <li>Expected Output: <pre>{test.expectedOutput}</pre></li>
                      <li>Result: <pre>{test.resultoftestcase}</pre></li>
                    </ul>
                  </li>
                ))}
              </ul>
            </Modal.Body>
          </Modal>
        </div>
      )}

      <ToastContainer /> {/* Notification container */}
    </div>
  );
};

export default ProblemPage;