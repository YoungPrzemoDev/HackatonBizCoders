import { View, Text, Image,ScrollView, FlatList} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'

const technologies = [
    { id: '1', name: 'JavaScript', icon: 'logo-javascript' },
    { id: '2', name: 'React', icon: 'logo-react' },
    { id: '3', name: 'Node.js', icon: 'logo-nodejs' },
  ];

export default function ScientInfo({scient}) {
    console.log(scient)

    const getScientistTechnologies = (scient) => {
        const technology = scient.technologies.split(','); 
      
        return technology
      };

    const getTechnologiesIcon = (technologyName) => {
        const technology = technologies.find(tech => tech.name === technologyName);
        return technology ? technology.icon : 'Unknown Icon';
      };
  return (
    <ScrollView>
      <Image source={{uri:scient.imageUrl}}
      style={{
        width: '100%',
        height: 400,
        objectFit:'cover'
      }}/>
        <View >
            <Text style={{
                marginTop:20,
                marginLeft:20,
                fontFamily:'outfit-bold',
                fontSize:40
            }}>{scient.name} {scient.secondName}</Text>

            <Text style={{
                marginLeft:20,
                fontFamily:'outfit',
                fontSize:20
            }}>{scient.localization}</Text>

            <View style={{
                height: 1,         
                backgroundColor: 'black',
                marginVertical: 20,
                marginHorizontal: 20,
            }} />

            <Text style={{
                marginLeft:20,
                marginRight:10,
                fontFamily:'outfit',
                fontSize:18
            }}>{scient.introdution}</Text>

            <View style={{
                height: 1,         
                backgroundColor: 'black',
                marginVertical: 20,
                marginHorizontal: 20,
            }} />
            
            <Text style={{
                marginTop:5,
                marginLeft:20,
                fontFamily:'outfit-bold',
                fontSize:20
            }}>My technologies</Text>

                <FlatList
                    data={getScientistTechnologies(scient)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 20,
                            marginVertical: 10
                        }}>
                            <Ionicons
                                name={getTechnologiesIcon(item)}
                                size={24}
                                color="black"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={{
                                fontFamily: 'outfit',
                                fontSize: 18
                            }}>{item}</Text>
                        </View>
                    )}
                />
        </View>
    </ScrollView>
  )
}