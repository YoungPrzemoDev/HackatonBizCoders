import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../../constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ScientsListItem from '../../components/ScientsListItem';

const { width } = Dimensions.get('window'); 
const technologies = [
  { id: '1', name: 'JavaScript', icon: 'logo-javascript' },
  { id: '2', name: 'React', icon: 'logo-react' },
  { id: '3', name: 'Node.js', icon: 'logo-nodejs' },
];

const scients = [
  { id: '1', name: 'Jacob', secondName: 'Smith', technologies : '1,3', localization: 'London', imageUrl: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg', introdution: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum '},
  { id: '2', name: 'Luke', secondName: 'Phil',technologies: '2' , localization:'Warsaw', imageUrl: 'https://img.freepik.com/premium-photo/young-scientist-working-with-chemical-laboratorymale-chemist-doing-experiments-labyoung-scient_912214-13005.jpg', introdution: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum '},
  { id: '3', name: 'Emanuel', secondName: 'Legolas',technologies: '1,2,3' , localization:'Paris', imageUrl: 'https://c8.alamy.com/comp/2ATD2PD/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PD.jpg', introdution: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum '},
];

export default function Maches() {
  const [isExpanded, setIsExpanded] = useState(false); 
  const [selectedTechnology, setSelectedTechnology] = useState(technologies[0]); 

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); 
  };

  const handleSelect = (item) => {
    setSelectedTechnology(item); 
    setIsExpanded(false); 
  };

  const filterScientistsByTechnology = () => {
    return scients.filter(scientist => {
      const technologyIds = scientist.technologies.split(',');
      return technologyIds.includes(selectedTechnology.id);
    });
  };

  return (
    <ImageBackground
      source={require('./../../assets/images/bg.png')}
      style={{
        flex: 1,
        resizeMode:'cover',
        paddingHorizontal: 10,
        flexDirection:'column',
        justifyContent:'flex-start'
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 70 }}>
        {}
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={toggleExpand} 
            style={{
              flexDirection:"row",
              width: width * 0.4, 
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10,
              borderColor: Colors.BLACK, 
              borderWidth: 1,
              shadowOpacity: 0.8,
              shadowRadius: 10,
              shadowColor: Colors.BLACK,
              shadowOffset: { height: 0.5, width: 0.5 },
              alignItems: 'center',
            }}
          >
            {}
            <Ionicons name={selectedTechnology.icon} size={30} color={Colors.BLACK} />
            <Text style={{
              marginLeft:10,
              fontFamily: "outfit-medium",
              color: Colors.BLACK,
              fontSize: 20
            }}>
              {selectedTechnology.name}
            </Text>
          </TouchableOpacity>

          {}
          {isExpanded && (
            <View style={{
              width: width * 0.4,
              marginTop: 10,
              borderColor: Colors.BLACK, 
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: Colors.WHITE,
              shadowOpacity: 0.8,
              shadowRadius: 10,
              shadowColor: Colors.BLACK,
              shadowOffset: { height: 0.5, width: 0.5 },
            }}>
              <FlatList
                data={technologies}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)} 
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.LIGHT_GREY, 
                    }}
                  >
                    <Ionicons name={item.icon} size={30} color={Colors.BLACK} />
                    <Text style={{
                      marginLeft: 10,
                      fontFamily: "outfit-medium",
                      color: Colors.BLACK,
                      fontSize: 18,
                    }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      
        <View style={{marginRight: 20}}>
          {}
          <TouchableOpacity
            //onPress={} 
            style={{
              flexDirection:"row",
              width: width * 0.25, 
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10,
              borderColor: Colors.BLACK, 
              borderWidth: 1,
              shadowOpacity: 0.8,
              shadowRadius: 10,
              shadowColor: Colors.BLACK,
              shadowOffset: { height: 0.5, width: 0.5 },
              alignItems: 'center',
            }}
          >
            {}
            <FontAwesome name='filter' size={30} color={Colors.BLACK} />
            <Text style={{
              marginLeft:10,
              fontFamily: "outfit-medium",
              color: Colors.BLACK,
              fontSize: 20
            }}>
              Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 20 }}>
        <FlatList
        data={filterScientistsByTechnology()}
        renderItem={({item,index})=>(
          <View>
              <ScientsListItem scient={item}/>
          </View>
        )}/>
      </View>
    </ImageBackground>
  );
}
