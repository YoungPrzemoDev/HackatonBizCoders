import { View, Text, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

const technologies = [
    { id: '1', name: 'JavaScript', icon: 'logo-javascript' },
    { id: '2', name: 'React', icon: 'logo-react' },
    { id: '3', name: 'Node.js', icon: 'logo-nodejs' },
  ];

  const ScientsListItem = ({scient}) => {
    const router=useRouter();

    const getScientistTechnologies = (scientist) => {
        const technologyIds = scientist.technologies.split(','); 
      
        return technologyIds.map(id => {
          const technology = technologies.find(tech => tech.id === id);
          return technology ? technology.name : 'Unknown Technology';
        });
      };

      const handlePress = () => {
        const scientistTechnologies = getScientistTechnologies(scient);
        router.push({
            pathname: '/scient-detail',
            params: {
                ...scient,
                technologies: scientistTechnologies 
            }
        });
    };

  return (
    <TouchableOpacity onPress={handlePress}>
        <View style={{
            padding:10,
            marginRight:15,
            backgroundColor:Colors.WHITE,
            borderRadius:10,
            marginBottom:20,
            shadowColor: Colors.BLACK,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 2.5,
            elevation: 10,
            flexDirection:'row'
        }}>
            <Image source={{uri:scient?.imageUrl}}
            style={{
                width:150,
                height:135,
                objectFit:'cover',
                borderRadius:10
            }}/>
            <View style={{
                flexDirection:'column',
                marginLeft:10
            }}>
                <Text style={{
                    fontFamily:'outfit-medium',
                    fontSize:25,
                }}>{scient.name} {scient.secondName}</Text>

                <Text style={{
                    fontFamily:'outfit',
                    fontSize:20,
                }}>{scient.localization}</Text>

                <Text style={{
                    fontFamily:'outfit',
                    fontSize:15,
                }}>{getScientistTechnologies(scient).join(', ')}</Text>

            </View>
        </View>
    </TouchableOpacity>
  )
}

export default ScientsListItem;