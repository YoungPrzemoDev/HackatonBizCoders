import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, Dimensions, StyleSheet, Image, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { db } from "../config/FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { BarChart, LineChart, StackedBarChart } from "react-native-chart-kit";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Colors } from "@/constants/Colors";

const screenWidth = Dimensions.get('window').width;

const Dashbords = () => {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [timeLines, setTimeLines] = useState([]);
  const [timeLines2, setTimeLines2] = useState([]);
  const [timeLinesAddFav, setTimeLinesAddFav] = useState([]);
  const [timeLinesAddGroup, setTimeLinesAddGroup] = useState([]);
  const [viewershipDataAll, setViewershipDataAll] = useState([]);
  const [addFavDataAll, setAddFavDataAll] = useState([]);
  const [addGroupDataAll, setAddGroupDataAll] = useState([]);

  const [loading, setLoading] = useState(true); // Add loading state
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        
        const currentUserId = 5;
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('userId', '==', currentUserId)); 
        console.log(currentUserId);
        const querySnapshot = await getDocs(q);
        const projectList = [];
        querySnapshot.forEach((doc) => {
          console.log(doc)
          projectList.push({ id: doc.id, name: doc.data().name });
        });
        
        
        setProjects(projectList);

        if (projectList.length > 0) {
          setSelectedProject(projectList[0].id);
        }
        
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    if (selectedProject) {
      const fetchProjectData = async () => {
        try {
          setLoading(true); // Start loading project data
          
          // Clear previous data before fetching new project data
          setTimeLines([]);
          setViewershipDataAll([]);

          const monthlyData = {};
          const docRef = doc(db, `projects/${selectedProject}/clickability/userActivity`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const viewership = data.viewership || [];
            const viewershipTime = data.viewershipTime || [];
            const addFav = data.addFav || [];
            const addFavTime = data.addFavTime || [];
            const addToGroup = data.addToGroup || [];
            const addToGroupTime = data.addToGroupTime || [];

            // Process the data as before
            viewershipTime.forEach((x, index) => {
              const date = x.toDate();
              const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

              const isLastOccurrence = viewershipTime.slice(index + 1).every(item => {
                const nextDate = item.toDate();
                const nextYearMonth = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}`;
                return nextYearMonth !== yearMonth;
              });

              if (isLastOccurrence) {
                if (!monthlyData[yearMonth]) {
                  monthlyData[yearMonth] = [];
                }
                monthlyData[yearMonth].push({ id: index });
              }
            });

            const selectedViewershipData = {};
            for (let month in monthlyData) {
              if (monthlyData.hasOwnProperty(month)) {
                const id = monthlyData[month][0].id;
                if (id >= 0 && id < viewership.length) {
                  const viewershipItem = viewership[id];
                  selectedViewershipData[month] = viewershipItem;
                }
              }
            }

            const months = Object.keys(monthlyData);
            setTimeLines(months);
            setViewershipDataAll(Object.values(selectedViewershipData));

            // Process the data as before
            const monthlyData2 = {};
            addFavTime.forEach((x, index) => {
              const date = x.toDate();
              const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

              const isLastOccurrence = addFavTime.slice(index + 1).every(item => {
                const nextDate = item.toDate();
                const nextYearMonth = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}`;
                return nextYearMonth !== yearMonth;
              });

              if (isLastOccurrence) {
                if (!monthlyData2[yearMonth]) {
                  monthlyData2[yearMonth] = [];
                }
                monthlyData2[yearMonth].push({ id: index });
              }
            });

            let diff2 = 0;
            const selectedAddFavData = {};
            for (let month in monthlyData2) {
              if (monthlyData2.hasOwnProperty(month)) {
                const id = monthlyData2[month][0].id;
                if (id >= 0 && id < addFav.length) {
                  const addFavItem = addFav[id] - diff2;
                  diff2 = addFavItem;
                  selectedAddFavData[month] = addFavItem;
                }
              }
            }
            console.log(selectedAddFavData);
            const months2 = Object.keys(monthlyData2);
            setTimeLinesAddFav(months2);
            setAddFavDataAll(Object.values(selectedAddFavData));
        
          
          // Process the data as before
          const monthlyData3 = {};
          addToGroupTime.forEach((x, index) => {
            const date = x.toDate();
            const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

            const isLastOccurrence = addToGroupTime.slice(index + 1).every(item => {
              const nextDate = item.toDate();
              const nextYearMonth = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}`;
              return nextYearMonth !== yearMonth;
            });

            if (isLastOccurrence) {
              if (!monthlyData3[yearMonth]) {
                monthlyData3[yearMonth] = [];
              }
              monthlyData3[yearMonth].push({ id: index });
            }
          });
          let diff = 0;
          const selectedAddToGroupData = {};
          for (let month in monthlyData3) {
            if (monthlyData3.hasOwnProperty(month)) {
              const id = monthlyData3[month][0].id;
              if (id >= 0 && id < addToGroup.length) {
                const addToGroupItem = addToGroup[id] - diff;
                diff = addToGroup[id];
                selectedAddToGroupData[month] = addToGroupItem;
              }
            }
          }
          console.log(selectedAddToGroupData);

          const months3 = Object.keys(monthlyData3);
          setTimeLinesAddGroup(months3);
          setAddGroupDataAll(Object.values(selectedAddToGroupData));
        }

          setLoading(false); // Stop loading after project data is fetched
        } catch (error) {
          console.error('Error fetching project data:', error);
          setLoading(false); // Stop loading on error
        }
      };

      fetchProjectData();
    }
  }, [selectedProject]);
  
  const fetchCurrentUserId = async () => {
    const auth = getAuth();
    const currentUserId = await AsyncStorage.getItem("userId");
    return currentUserId || auth.currentUser?.uid || null;
  };

  const renderChartView = () => (
    <ScrollView>
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Viewership in Recent Months</Text>
      <LineChart
        data={{
          labels: timeLines,
          datasets: [{ data: viewershipDataAll }],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: Colors.SECOND,
          backgroundGradientFrom: Colors.SECOND,
          backgroundGradientTo: Colors.SECOND,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        fromZero={true}
        style={styles.chart}
      />
      
    </View>
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Joining to chat in Recent Months</Text>
      <BarChart
        data={{
          labels: timeLinesAddGroup,
          datasets: [{ data: addGroupDataAll }],
        }}
        width={screenWidth - 40}
        yAxisSuffix=""
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#2e2e2e',
          backgroundGradientFrom: '#3a3a3a',
          backgroundGradientTo: '#4a4a4a',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        fromZero={true}
        style={styles.chart}
      />
    </View>
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Adding to favorities in Recent Months</Text>
      <BarChart
        data={{
          labels: timeLinesAddFav,
          datasets: [{ data: addFavDataAll }],
        }}
        width={screenWidth - 40}
        yAxisSuffix=""
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#2e2e2e',
          backgroundGradientFrom: '#3a3a3a',
          backgroundGradientTo: '#4a4a4a',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        fromZero={true}
        style={styles.chart}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setExpandedCardId(null)}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text> {/* Show loading indicator */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {expandedCardId !== null ? (
        renderChartView()  // Render chart view when expandedCardId is set
      ) : (
        <>
          <Text style={styles.dashboardTitle}>Your Dashboard</Text>
          <FlatList
            data={projects}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tile}
                onPress={() => {
                  setExpandedCardId(item.id); // Set the expanded card ID for the chart view
                  setSelectedProject(item.id); // Set the selected project to fetch its data
                }}
              >
                <Image 
                  source={{ uri: 'https://cdn.prod.website-files.com/5efb0b7816032fd33ce6059c/63ab5c512e85b3727eb257f7_power-bi-top-dashboard-examples-executive.webp' }} 
                  style={styles.tileImage}
                />
                <Text style={styles.tileText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tileContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 40
    },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tileContainer: {
    flexDirection: 'column',
    paddingBottom: 20,
  },
  tile: {
    width: screenWidth*0.8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  tileImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  tileText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  backButton: {
    backgroundColor: Colors.MAIN,
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Dashbords;
