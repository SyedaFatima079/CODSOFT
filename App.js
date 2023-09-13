
import { View, Text, TextInput, Button, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    // Load tasks from AsyncStorage when the component mounts
    loadTasks();
  }, []);

  useEffect(() => {
    // Save tasks to AsyncStorage whenever they change
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = () => {
    if (editingIndex !== null) {
      // If editing, update the task at editingIndex
      const newTasks = [...tasks];
      newTasks[editingIndex] = { ...newTasks[editingIndex], title: task };
      setTasks(newTasks);
      setEditingIndex(null);
    } else if (task.trim() !== '') {
      // If not editing and task is not empty, add a new task
      setTasks([...tasks, { title: task, completed: false }]);
    }
    setTask('');
  };

  const startEditing = (index) => {
    // Set the task and editing index for editing
    setTask(tasks[index].title);
    setEditingIndex(index);
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    setEditingIndex(null); // Clear editing when removing
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
    setTasks(newTasks);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 36, marginBottom: 20, fontWeight:'bold', color:'green', alignSelf:'center', marginTop:100 }}>To-Do List</Text>
      <Image source={require('./TODO.jpg')} style={{height:150, width:150, alignSelf:'center', marginTop:20}}></Image>
            <TextInput
        placeholder={editingIndex !== null ? "Edit task" : "Add a new task"}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <Button  color="green" title={editingIndex !== null ? "Save Edit" : "Add Task"} onPress={addTask} />
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>{item.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button  color="green" title="Edit" onPress={() => startEditing(index)}  />
              <Button  color="green" title={item.completed ? "Activate" : "Complete"} onPress={() => toggleTaskCompletion(index)} />
              <Button  color="green" title="Remove" onPress={() => removeTask(index)} />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default App;
