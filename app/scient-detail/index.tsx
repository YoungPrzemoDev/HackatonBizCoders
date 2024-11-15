import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import ScientInfo from '../../components/ScientInfo';

const ScientDetail = () => {
    const scient = useLocalSearchParams();
    const navigation = useNavigation();
    console.log(scient)
    useEffect(()=>{
        navigation.setOptions({
            headerTitle:''
        })
    },[])
  return (
    <View>
      <ScientInfo scient={scient}/>
    </View>
  )
}
export default ScientDetail;