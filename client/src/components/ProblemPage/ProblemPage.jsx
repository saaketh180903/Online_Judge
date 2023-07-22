import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Modal } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProblemPage.css';

const ProblemPage = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [receivedOutput, setReceivedOutput] = useState('');
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const defaultCodes = {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    c: `#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    python: `print("Hello, World!")`,
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Problem/${pid}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    setCode(defaultCodes[language]);
    fetchProblem();
  }, [pid, language]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setReceivedOutput(false);

    try {
      setIsLoading1(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/ProblemSubmission',
        {
          title: problem.title,
          code,
          language,
          difficulty: problem.difficulty,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log('Problem solution submitted:', response.data.submission);
      setSubmission(response.data.submission);
      if (response.data.output) {
        setReceivedOutput(response.data.output);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error submitting problem solution:', error);
      toast.error('Failed to Submit code. Please try again.');
    } finally {
      setIsLoading1(false);
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);

    switch (selectedLanguage) {
      case 'cpp':
        setCode(defaultCodes.cpp);
        break;
      case 'java':
        setCode(defaultCodes.java);
        break;
      case 'c':
        setCode(defaultCodes.c);
        break;
      case 'python':
        setCode(defaultCodes.python);
        break;
      default:
        setCode('');
        break;
    }
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

      const userEmail = response.data;
      if (userEmail == null) {
        toast.error('Please log in to view your submissions.');
      } else {
        navigate(
          `/submissions?problemTitle=${encodeURIComponent(
            problem.title
          )}&userEmail=${encodeURIComponent(userEmail)}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Please log in to view your submissions.');
      } else {
        console.error('Error retrieving user email:', error);
      }
    }
  };

  const handleRunCode = async () => {
    setSubmission(false);
    try {
      setIsLoading2(true);
      const response = await axios.post(
        'http://localhost:3001/RunCode',
        {
          code,
          input: customInput,
          language,
        }
      );

      setReceivedOutput(response.data.output);
    } catch (error) {
      console.error('Error running code:', error);
      toast.error('Failed to run code. Please try again.');
    } finally {
      setIsLoading2(false);
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
              <div className="form-group" controlId="customInput">
                <label>Custom Input:</label>
                <input
                  className="form-control"
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </div>
              <div className="form-group" controlId="code">
                <label>Code:</label>
                <AceEditor
                  mode={language === 'java' ? 'java' : language === 'python' ? 'python' : 'c_cpp'}
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
                  <option value="c">C</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <Button variant="primary" type="submit" disabled={isLoading1}>
                {isLoading1 ? 'Submitting...' : 'Submit'}
              </Button>
              <Button variant="secondary" type="button" onClick={handleRunCode} disabled={isLoading2}>
                {isLoading2 ? 'Running...' : 'Run'}
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

      <div>
        <h3>Received Output:</h3>
        <pre>{receivedOutput}</pre>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProblemPage;