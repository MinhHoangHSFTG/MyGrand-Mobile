import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Pressable, Linking, Button, PermissionsAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system'; // Thêm thư viện FileSystem


const windowHeight = Dimensions.get('window').height;
const topMargin = 50;
let recording = new Audio.Recording();
const host = 'https://mygrand-api.vercel.app/api/';

const Mainhome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toggleVoice, setToggleVoice] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [text, setText] = useState("");
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const buttonSpacing = windowHeight * 0.3; // 30% chiều cao của màn hình
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const a = windowHeight * 0.075; // 10% của chiều cao của màn hình
  const whiteRectangleWidth = windowWidth * 0.8; // 70% của chiều rộng của màn hình
  const headerHeight = windowHeight * 0.2;
  const topwhite = headerHeight - 50;
  const topwuser = headerHeight - 150;
  const frameheader = windowHeight * 0.2;
  const topweather = -8
  const buttonMargin = 30;


  async function uploadAudioToServer(uri) {
    const apiUrl = host + '/get-text-from-voice';
    try {
      const fileData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })

      const options = {
        method: 'POST',
        body: JSON.stringify({
          audio: fileData
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        console.log(`Cannot upload: ${response.status}`);
        return;
      }
      const data = await response.json();
      setText(data.hypotheses[0].utterance)


    } catch (error) {
      console.error(error);
    }

  }


  async function startRecording() {

    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function getCommand(text) {
    const apiUrl = host + '/get-command';
    try {

      const options = {
        method: 'POST',
        body: JSON.stringify({
          text
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        console.log(`Cannot upload: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log(data);

      if (data.error) return;
      switch (data.object.toLowerCase()) {
        case "youtube":
          openYouTubeApp();
          break;
        case "thời tiết":
          openWeatherApp();
          break;
        case "facebook":
          openFacebookApp();
          break;
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    await uploadAudioToServer(uri);
    await getCommand(text);

    console.log('Recording stopped and stored at', uri);

    recording = new Audio.Recording();
  }

  const [isRecording, setIsRecording] = useState(false);
  const showVoiceChat = async () => {
    if (!toggleVoice) {
      try {
        await startRecording();
        setToggleVoice(true);
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    } else {
      try {
        await stopRecording();

        setToggleVoice(false);
        setIsRecording(false);
      } catch (error) {
        console.error('Failed to stop recording and upload audio:', error);
      }
    }
  };

  // Khi không có ghi âm (isRecording là false) thì không hiển thị voice assistant
  {
    isRecording &&
      <View style={styles.voiceAssistant}>
        <Text style={styles.botInteractionMessage}>Bà cần giúp đỡ gì ạ</Text>
        <Image source={require('../assets/sound-waves.png')} style={styles.soundWaves} />
      </View>
  }

  const openYouTubeApp = () => {
    Linking.openURL('https://www.youtube.com/');
  };

  const openFacebookApp = () => {
    Linking.openURL('https://fb.com/');
  };

  const openWeatherApp = () => {
    Linking.openURL('https://www.msn.com/en-us/weather/forecast/');
  };


  return (
    <>
      {/* <BottomNavBar /> */}
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { height: headerHeight }]}>
          <Text style={[styles.userNameText, { top: topwuser, paddingRight: frameheader }]}>Tên Người Dùng</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.notificationButton, { top: topwuser }]}>
              <Text style={styles.buttonText}>Thông báo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.numberButton, { top: topwuser }]}>
              <Text style={styles.buttonText}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>





        {showButtons && (
          <View style={styles.buttonRows}>
            {/* Các nút ở đây */}







            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={openYouTubeApp}>
                <Image source={require('../assets/xemphim.png')} style={styles.img} />
                <Text style={styles.buttonText_app}>Coi phim</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openYouTubeApp}>
                <Image source={require('../assets/game.png')} style={styles.img} />
                <Text style={styles.buttonText_app}>Giải trí</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openYouTubeApp}>
                <Image source={require('../assets/goidien.png')} style={styles.img} />
                <Text style={styles.buttonText_app}>Gọi điện</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={openYouTubeApp}>
                <Image source={require('../assets/nexflix.png')} style={styles.img} />
                <Text style={styles.buttonText_app}>nexflix</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openYouTubeApp}>
                <Image source={require('../assets/control.png')} style={styles.img} />
                <Text style={styles.buttonText_app}>Điều khiển</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openYouTubeApp}>
                <Image source={require('../assets/other.png')} style={styles.img} />
                <Text style={styles.buttonText_app}>Khác</Text>
              </TouchableOpacity>
            </View>




          </View>
        )}




        <View style={[styles.whiteRectangle, { width: whiteRectangleWidth, top: topwhite, flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={styles.clockText}>Đồng hồ</Text>
          <TouchableOpacity style={styles.buttonWeather}></TouchableOpacity>
          <TouchableOpacity style={[styles.buttonWeather, { marginLeft: buttonMargin }]}></TouchableOpacity>
          <TouchableOpacity style={[styles.buttonWeather, { marginLeft: buttonMargin }]}></TouchableOpacity>
          <TouchableOpacity style={[styles.buttonWeather, { marginLeft: buttonMargin }]}></TouchableOpacity>
          <TouchableOpacity style={[styles.buttonWeather, { marginLeft: buttonMargin }]}></TouchableOpacity>
          <TouchableOpacity style={[styles.buttonWeather, { marginLeft: buttonMargin }]}></TouchableOpacity>
          <Text style={styles.hourText}>
            {currentTime.getHours().toString().padStart(2, '0')}:
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </Text>
          <Text style={styles.dateText}>
            {currentTime.getDate().toString().padStart(2, '0')}/
            {(currentTime.getMonth() + 1).toString().padStart(2, '0')}/
            {currentTime.getFullYear()}
          </Text>
        </View>
        {toggleVoice &&
          <View style={styles.voiceAssistant}>
            <Text style={styles.botInteractionMessage}>Bà cần giúp đỡ gì ạ</Text>
            <Image source={require('../assets/sound-waves.png')} style={styles.soundWaves} />
          </View>
        }
        <Pressable
          onPress={showVoiceChat}
          style={styles.voiceBtn}
        ><Ionicons name="mic" style={styles.voiceBtnText}></Ionicons></Pressable>
      </SafeAreaView>
    </>
  );


};


const styles = StyleSheet.create({



  buttonRows: {
    flexDirection: 'column',
    alignItems: 'center',
    left: 50,
    top: -0
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 100, // Khoảng cách giữa hai hàng
  },

  img: {
    height: 90,
    width: 90,
  },
  voiceBtnText: {
    fontSize: 50,
    color: 'white',
    transform: [{ translateX: 1.5 }]
  },
  voiceBtn: {
    padding: 25,
    backgroundColor: '#235C25',
    borderRadius: 999,
    position: 'absolute',
    bottom: 100,
    right: 250,
    zIndex: 2, // Đặt zIndex lớn hơn để nút micro hiển thị ở trên
  },
  soundWaves: {
    width: '55%',
    height: '55%',
    marginHorizontal: 'auto'
  },
  botInteractionMessage: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold'
  },
  voiceAssistant: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '80%',
    height: 299,
    borderRadius: 10,
    backgroundColor: '#235C25',
    padding: 10
  },
  buttonWeather: {
    height: 80,
    width: 50,
    left: 120,
    marginRight: -20,
    borderRadius: 3.125 * 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    top: 0,
    display: 'flex',
    width: '100%',
    height: '10%',
    backgroundColor: '#235C25',
    flexDirection: 'row',
    paddingRight: 16,
    paddingBottom: 16,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 5
  },

  whiteRectangle: {
    height: 90,
    padding: 50,

    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
  },

  clockText: {
    color: '#2F2F2F',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    position: 'absolute',
    top: 5,
    left: 15,
    marginTop: 10
  },

  hourText: {
    color: '#2F2F2F',
    fontFamily: 'Roboto',
    fontSize: 35,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 35,
    position: 'absolute',
    bottom: 25,
    left: 15,
  },

  dateText: {
    top: 70,
    color: '#2F2F2F',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    left: 15,
    position: 'absolute',
    bottom: 5, // Đặt vị trí dưới cùng của hình chữ nhật trắng, cách 5px so với clockText
    left: 15, // Đặt vị trí từ mép phải của hình chữ nhật trắng
    marginBottom: 10
  },

  button: {
    height: 38,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },

  notificationButton: {
    marginRight: 5,
    paddingHorizontal: 15,
  },

  numberButton: {

    width: 38,
  },

  buttonText: {
    color: '#000',
    // Căn giữa theo chiều ngang
    // Để tạo khoảng cách giữa hình ảnh và văn bản
  },

  buttonText_app: {
    color: '#000',
    fontSize: 28,
    top: 0,
    textAlign: 'center', // Căn giữa theo chiều ngang
    // Để tạo khoảng cách giữa hình ảnh và văn bản
  },

});

export default Mainhome;