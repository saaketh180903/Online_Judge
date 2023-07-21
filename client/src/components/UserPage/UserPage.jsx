import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    acceptanceRate: '',
    testCases: [{ input: '', expectedOutput: '' }],
    difficulty: 'easy',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const response = await axios.get('http://localhost:3001/UserProfile', config);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleAddProblem = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };

      // Send the problem data to the server
      const response = await axios.post('http://localhost:3001/AddProblem', problemData, config);
      console.log('Problem added:', response.data);

      // You can perform any additional actions upon successful addition of the problem
      setShowAddProblem(false);
      setProblemData({
        title: '',
        description: '',
        acceptanceRate: '',
        testCases: [{ input: '', expectedOutput: '' }],
        difficulty: 'easy',
      });
      setError('');
    } catch (error) {
      console.error('Error adding problem:', error);
      setError('Failed to add problem');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblemData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...problemData.testCases];
    updatedTestCases[index][field] = value;
    setProblemData((prevState) => ({
      ...prevState,
      testCases: updatedTestCases,
    }));
  };

  const handleAddTestCase = () => {
    setProblemData((prevState) => ({
      ...prevState,
      testCases: [...prevState.testCases, { input: '', expectedOutput: '' }],
    }));
  };

  const handleRemoveTestCase = (index) => {
    setProblemData((prevState) => ({
      ...prevState,
      testCases: prevState.testCases.filter((_, i) => i !== index),
    }));
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const isAdmin = user.isAdmin; // Check if the user is an admin

  return (
    <Container>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Email</Card.Title>
              <Card.Text>{user.email}</Card.Text>
              {isAdmin && (
                <Button variant="primary" onClick={() => setShowAddProblem(true)}>
                Add Problem
                </Button>
              )}
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Problem Modal */}
      {showAddProblem && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Add Problem</h3>
            <Form>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={problemData.title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={problemData.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="acceptanceRate">
                <Form.Label>Acceptance Rate</Form.Label>
                <Form.Control
                  type="text"
                  name="acceptanceRate"
                  value={problemData.acceptanceRate}
                  onChange={handleChange}
                />
              </Form.Group>
              <h5>Test Cases</h5>
              {problemData.testCases.map((testCase, index) => (
                <div key={index}>
                  <Form.Group controlId={`input${index}`}>
                    <Form.Label>Input</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={`input${index}`}
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId={`expectedOutput${index}`}>
                    <Form.Label>Expected Output</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={`expectedOutput${index}`}
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(index, 'expectedOutput', e.target.value)
                      }
                    />
                  </Form.Group>
                  {index > 0 && (
                    <Button variant="danger" onClick={() => handleRemoveTestCase(index)}>
                      Remove Test Case
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="primary" onClick={handleAddTestCase}>
                Add Test Case
              </Button>
              <Form.Group controlId="difficulty">
                <Form.Label>Difficulty</Form.Label>
                <Form.Control
                  as="select"
                  name="difficulty"
                  value={problemData.difficulty}
                  onChange={handleChange}
                  defaultValue="easy"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Control>
              </Form.Group>
              {error && <p>Error: {error}</p>}
              <Button variant="secondary" onClick={() => setShowAddProblem(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddProblem}>
                Add Problem
              </Button>
            </Form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
