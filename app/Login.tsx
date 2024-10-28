import React, { useState } from 'react'
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native'


const screenWidth = Dimensions.get('window').width;



export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  return (
    <Container>
      <InnerContainer>
        <KeyboardAwareScrollView>
          <Header>
            <HeaderImg
              alt="Logo"
              resizeMode="contain"
              source={require('../assets/images/letter-b.gif')}
            />
            <Title>
              Sign in to <Title style={{ color: '#4acacd' }}>Binder</Title>
            </Title>
            <Subtitle>The place where Innovation meets Investmen</Subtitle>
          </Header>

          <Form>
            <InputGroup>
              <InputLabel>Email address</InputLabel>
              <InputControl
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                value={form.email}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputControl
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={password => setForm({ ...form, password })}
                placeholder="************"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={form.password}
              />
            </InputGroup>
            <FormAction>
              <Button onPress={() => router.push('/(tabs)/home')}>
                <ButtonText>Sign in</ButtonText>
              </Button>
            </FormAction>
            <FormLink>
              <Link href="/Login">
              Forgot password?
              </Link>
            </FormLink>
          </Form>
        </KeyboardAwareScrollView>
        <TouchableOpacity onPress={() => { /*  */ }} 
        style={{ marginTop: 'auto' }}>
          <FormFooter>
            Don't have an account?
            <SignUpLink>
              <SignUpLink>
                <Link href="/Select">
                  Sign up
                </Link>
              </SignUpLink>
            </SignUpLink>
          </FormFooter>
        </TouchableOpacity>
      </InnerContainer>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color:F0F0F0;
`;

const InnerContainer = styled.View`
  flex: 1;
  padding: 20px;
  width: ${screenWidth > 768 ? '600px' : '100%'};
  margin-top: ${screenWidth > 1024 ? '100px' : screenWidth > 768 ? '10px' : '30px'};
  align-self: center;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderImg = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  border-radius:10px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  text-align: center;
  color: #6b7280;
`;

const Form = styled.View`
  margin-top: 20px;
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 14px;
  color: #111827;
  margin-bottom: 5px;
`;

const InputControl = styled(TextInput)`
  padding: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #111827;
`;

const FormAction = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const Button = styled(TouchableOpacity)`
  background-color: #4acacd;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const FormLink = styled.Text`
  margin-top: 20px;
  text-align: center;
  color: #075eec;
  text-decoration-line: underline;
`;

const FormFooter = styled.Text`
  text-align: center;
  color: #6b7280;
`;

const SignUpLink = styled.Text`
  text-decoration-line: underline;
  color: #075eec;
`;