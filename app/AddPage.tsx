import React, { useState, useEffect } from 'react';
import './SubirArch.css';
import { ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import client from '../src/apollo-client'; // Asegúrate de importar el cliente creado anteriormente

const LIST_SUBJECTS = gql`
  query ListSubjects {
    listSubjects {
      items {
        id
        name
      }
    }
  }
`;

const ADD_SUBJECT_WITH_TOPIC = gql`
  mutation AddSubjectWithTopic($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      id
      name
      topics {
        items {
          id
          name
        }
      }
    }
  }
`;

const ADD_TOPIC_TO_SUBJECT = gql`
  mutation AddTopicToSubject($input: CreateTopicInput!) {
    createTopic(input: $input) {
      id
      name
      subjectID
    }
  }
`;

const AddPage: React.FC = () => {
  const [isAddingSubject, setIsAddingSubject] = useState(true);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [existingSubject, setExistingSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const { data: subjectsData, refetch } = useQuery(LIST_SUBJECTS, { client });
  const [addSubjectWithTopic] = useMutation(ADD_SUBJECT_WITH_TOPIC, { client });
  const [addTopicToSubject] = useMutation(ADD_TOPIC_TO_SUBJECT, { client });

  useEffect(() => {
    if (subjectsData) {
      setSubjects(subjectsData.listSubjects.items.map((item: any) => item.name));
    }
  }, [subjectsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isAddingSubject) {
        const { data } = await addSubjectWithTopic({ variables: { input: { name: subject } } });
        const subjectId = data.createSubject.id;
        await addTopicToSubject({ variables: { input: { name: topic, subjectID: subjectId } } });
        setMessage('Materia y tema agregados exitosamente.');
      } else {
        await addTopicToSubject({ variables: { input: { name: topic, subjectID: existingSubject } } });
        setMessage('Tema agregado a materia existente exitosamente.');
      }
      refetch();
    } catch (error) {
      setMessage('Ocurrió un error. Inténtalo nuevamente.');
      console.error('Error:', error);
    }
  };

  return (
    <ApolloProvider client={client}>
      <div className="form-container">
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="addSubject"
              checked={isAddingSubject}
              onChange={() => setIsAddingSubject(true)}
            />
            Agregar materia con tema
          </label>
          <label>
            <input
              type="radio"
              value="addTopic"
              checked={!isAddingSubject}
              onChange={() => setIsAddingSubject(false)}
            />
            Agregar tema a materia existente
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {isAddingSubject ? (
            <>
              <label>
                Introducir nombre de materia (obligatorio):
                <input 
                  type="text" 
                  placeholder="Materia" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required 
                />
              </label>
            </>
          ) : (
            <label>
              Seleccionar materia existente:
              <select
                value={existingSubject}
                onChange={(e) => setExistingSubject(e.target.value)}
                required
              >
                <option value="" disabled>Seleccionar materia</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Introducir nombre del tema (obligatorio):
            <input 
              type="text" 
              placeholder="Tema" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required 
            />
          </label>
          <button type="submit">Subir</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </ApolloProvider>
  );
};

export default AddPage;
