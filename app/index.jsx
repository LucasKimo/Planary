// import { MAPBOX_ACCESS_TOKEN } from '@env'
// import { useState, useEffect, useRef } from 'react'
// import { View, StyleSheet, Alert, Text, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
// import MapboxGL from '@rnmapbox/maps'
// import * as Location from 'expo-location'
// import { Ionicons } from '@expo/vector-icons'

// // Mapbox AccessToken
// MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

// // MapTiler API Key
// const MAPTILER_KEY = 'C8SW28jEabY227vOpHTk'
// const MAP_STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`

// export default function App() {
//   const [userLocation, setUserLocation] = useState(null)
//   const [mapCenter, setMapCenter] = useState(null)
//   const [active, setActive] = useState(false)
//   const [isUserCentered, setIsUserCentered] = useState(true) // 사용자가 중심에 있는지 추적
//   const [searchQuery, setSearchQuery] = useState('')
//   const mapRef = useRef(null)
//   const cameraRef = useRef(null)

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync()
//       if (status !== 'granted') {
//         Alert.alert(
//           'Location Permission Required',
//           'Location permission is needed to use the map.'
//         )
//         setMapCenter([0, 0])
//         return
//       }

//       try {
//         let location = await Location.getCurrentPositionAsync({})
//         const initialCoords = [location.coords.longitude, location.coords.latitude]
//         setUserLocation(initialCoords)
//         setMapCenter(initialCoords)
//         setActive(true) // 초기에는 사용자 위치에 있으므로 활성화
//         setIsUserCentered(true) // 초기에는 사용자 중심
//       } catch (error) {
//         Alert.alert('Failed to Get Location', 'Failed to retrieve current location.')
//         console.error(error)
//         setMapCenter([0, 0])
//       }
//     })()
//   }, [])

//   // 현재 카메라 위치 상태 추가
//   const [currentCameraPosition, setCurrentCameraPosition] = useState(null);

//   // 카메라 위치가 변경될 때마다 사용자 위치와 비교
//   useEffect(() => {
//     if (userLocation && currentCameraPosition) {
//       // 거리 계산 (미터 단위)
//       const distance = getDistanceFromLatLonInKm(
//         userLocation[1], userLocation[0], 
//         currentCameraPosition[1], currentCameraPosition[0]
//       ) * 1000; // 킬로미터를 미터로 변환

//       // 100미터 이내면 활성화, 그 이상이면 비활성화
//       const isNearUserLocation = distance < 100;
      
//       if (isNearUserLocation !== active) {
//         setActive(isNearUserLocation);
//         console.log(`Distance from user: ${distance.toFixed(2)}m, Active: ${isNearUserLocation}`);
//       }
//     }
//   }, [userLocation, currentCameraPosition, active]);

//   // 두 좌표 간의 거리를 계산하는 함수 (킬로미터 단위)
//   const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // 지구의 반지름 (km)
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     const d = R * c; // 거리 (km)
//     return d;
//   }

//   const deg2rad = (deg) => {
//     return deg * (Math.PI/180);
//   }

//   // 카메라 이동 이벤트 핸들러들
//   const onCameraChanged = (state) => {
//     // 사용자가 지도를 수동으로 움직였을 때만 비활성화
//     if (isUserCentered) {
//       setActive(false);
//       setIsUserCentered(false);
//     }
//   };

//   const onRegionWillChange = () => {
//     // 지도가 움직이기 시작할 때 즉시 비활성화 (사용자 액션인 경우)
//     if (isUserCentered) {
//       setActive(false);
//       setIsUserCentered(false);
//     }
//   };

//   const onMapPress = async (e) => {
//     const lngLat = e.geometry.coordinates
//     const screenX = e.properties.screenPointX
//     const screenY = e.properties.screenPointY

//     console.log('You tapped: ', lngLat)
//     console.log('Screen coords: ', screenX, screenY)

//     if (!mapRef.current) return

//     try {
//       const result = await mapRef.current.queryRenderedFeaturesAtPoint(
//         [screenX, screenY],
//         [],
//         []
//       )

//       const features = result?.features || []

//       if (features.length === 0) {
//         console.log('No features found at this point.')
//         return
//       }

//       features.forEach(f => {
//         console.log(
//           `class: ${f.properties?.class}, name: ${f.properties?.name}`
//         )
//       })

//       const targetFeature = features.find(f =>
//         ['stadium', 'ferry_terminal', 'attraction', 'art_gallery', 'museum', 'international', 'library', 'motorway', 'town_hall', 'path', 'primary', 'secondary', 'park', 'cafe', 'fast_food', 'restaurant', 'bar', 'lodging', 'bus', 'school', 'college', 'pitch', 'railway', 'hospital', 'parkint', 'neighbourhood', 'suburb', 'city', 'town', 'village', 'state', 'country', 'island', 'ocean'].includes(f.properties?.class)
//       )

//       if (!targetFeature) {
//         console.log('No city/state/country label here — ignored.')
//         return
//       }

//       let newCenter = lngLat

//       if (targetFeature.geometry?.type === 'Point') {
//         newCenter = targetFeature.geometry.coordinates
//       } else if (targetFeature.geometry?.type === 'Polygon') {
//         const coords = targetFeature.geometry.coordinates[0]
//         const lngs = coords.map(c => c[0])
//         const lats = coords.map(c => c[1])
//         const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
//         const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
//         newCenter = [centerLng, centerLat]
//       }

//       const featureClass = targetFeature.properties?.class
//       let zoomLevel = 13

//       if (featureClass === 'country') {
//         zoomLevel = 5
//       } else if (featureClass === 'state') {
//         zoomLevel = 7
//       } else if (['city', 'town', 'village'].includes(featureClass)) {
//         zoomLevel = 13
//       } else if (['suburb', 'neighbourhood'].includes(featureClass)) {
//         zoomLevel = 16
//       } else if (['stadium', 'ferry_terminal', 'attraction', 'art_gallery', 'museum', 'international', 'motorway', 'town_hall', 'path', 'primary', 'secondary', 'park', 'college', 'cafe', 'lodging', 'fast_food', 'restaurant', 'library', 'bar', 'railway', 'bus', 'school', 'pitch', 'hospital', 'parking'].includes(featureClass)) {
//         zoomLevel = 17
//       }

//       console.log(
//         `Moving to "${targetFeature.properties?.name}" (class: ${featureClass}) at [${newCenter}] with zoomLevel: ${zoomLevel}`
//       )

//       if (cameraRef.current) {
//         cameraRef.current.setCamera({
//           centerCoordinate: newCenter,
//           zoomLevel: zoomLevel,
//           animationMode: 'flyTo',
//           animationDuration: 2000,
//         })
//       } else {
//         console.log('cameraRef is null')
//       }

//     } catch (error) {
//       console.error('Error querying features: ', error)
//     }
//   };


//   if (!userLocation) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading location...</Text>
//       </View>
//     )
//   }

//   return (
//     <View style={styles.page}>
//       <MapboxGL.MapView
//         style={styles.map}
//         styleURL={MAP_STYLE}
//         onPress={onMapPress}
//         onRegionWillChange={onRegionWillChange}
//         ref={mapRef}
//       >
//         <MapboxGL.Camera
//           ref={cameraRef}
//           zoomLevel={13}
//           centerCoordinate={mapCenter}
//           animationMode="flyTo"
//           animationDuration={2000}
//           onCameraChanged={onCameraChanged}
//         />

//         <MapboxGL.PointAnnotation id="userLocation" coordinate={userLocation}>
//           <View style={styles.userLocationMarker} />
//         </MapboxGL.PointAnnotation>
//       </MapboxGL.MapView>
//       <View style={styles.searchContainer}>
//         <TextInput 
//           style={styles.searchInput}
//           placeholder="Search for a place"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           onSubmitEditing={onSearch}
//           />
//           <TouchableOpacity onPress{}
//       </View>
//       <TouchableOpacity
//         style={[
//           styles.floatingButton,
//           active && { backgroundColor: 'black' }
//         ]}
//         onPress={() => {
//           console.log('Navigation button pressed!');
//           if (cameraRef.current && userLocation) {
//             setIsUserCentered(true); // User pressed the navigation button
//             setActive(true); // Activate button
//             cameraRef.current.setCamera({
//               centerCoordinate: userLocation,
//               zoomLevel: 14,
//               animationMode: 'flyTo',
//               animationDuration: 2000,
//             });
//           }
//         }}
//       >
//         <Ionicons 
//           name="navigate"
//           size={28} 
//           color={active ? 'white' : 'black'} 
//         />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userLocationMarker: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: 'blue',
//     borderWidth: 2,
//     borderColor: 'white',
//   },
//   floatingButton: {
//     position: 'absolute',
//     bottom: 50,
//     right: 20,
//     backgroundColor: 'white',
//     borderRadius: 25,
//     padding: 12,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
// });


import { MAPBOX_ACCESS_TOKEN } from '@env'
import { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

const MAPTILER_KEY = 'C8SW28jEabY227vOpHTk'
const MAP_STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`

export default function App() {
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  const [active, setActive] = useState(false)
  const [isUserCentered, setIsUserCentered] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const mapRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Location permission is needed to use the map.'
        )
        setMapCenter([0, 0])
        return
      }

      try {
        let location = await Location.getCurrentPositionAsync({})
        const initialCoords = [location.coords.longitude, location.coords.latitude]
        setUserLocation(initialCoords)
        setMapCenter(initialCoords)
        setActive(true)
        setIsUserCentered(true)
      } catch (error) {
        Alert.alert('Failed to Get Location', 'Failed to retrieve current location.')
        console.error(error)
        setMapCenter([0, 0])
      }
    })()
  }, [])

  const onCameraChanged = () => {
    if (isUserCentered) {
      setActive(false)
      setIsUserCentered(false)
    }
  }

  const onRegionWillChange = () => {
    if (isUserCentered) {
      setActive(false)
      setIsUserCentered(false)
    }
  }

  const fetchCoordinates = async (query) => {
    const resp = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    )
    const json = await resp.json()
    if (!json.features.length) throw new Error('No results')
    return json.features[0].center // [lng, lat]
  }

  const onSearch = async () => {
    if (!searchQuery) return

    try {
      const coords = await fetchCoordinates(searchQuery)
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: coords,
          zoomLevel: 14,
          animationMode: 'flyTo',
          animationDuration: 2000,
        })
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Not Found', 'Could not find location')
    }
  }

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading location...</Text>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MAP_STYLE}
        onRegionWillChange={onRegionWillChange}
        ref={mapRef}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={13}
          centerCoordinate={mapCenter}
          animationMode="flyTo"
          animationDuration={2000}
          onCameraChanged={onCameraChanged}
        />

        {/* <MapboxGL.ScaleBar
          style={{ position: 'absolute', bottom: 20, left: 10 }}
        /> */}

        <MapboxGL.PointAnnotation id="userLocation" coordinate={userLocation}>
          <View style={styles.userLocationMarker} />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      {/* 🔍 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a place"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
      </View>

      {/* 🧭 현재위치 버튼 */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          active && { backgroundColor: 'black' }
        ]}
        onPress={() => {
          if (cameraRef.current && userLocation) {
            setIsUserCentered(true)
            setActive(true)
            cameraRef.current.setCamera({
              centerCoordinate: userLocation,
              zoomLevel: 14,
              animationMode: 'flyTo',
              animationDuration: 2000,
            })
          }
        }}
      >
        <Ionicons
          name="navigate"
          size={28}
          color={active ? 'white' : 'black'}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    borderWidth: 2,
    borderColor: 'white',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchButton: {
    marginLeft: 10,
  },
})
