/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component,Children,cloneElement} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing
  
} from 'react-native';
import { 
  Button,
  Card,
  Appbar,
  TextInput,
  Subheading,
  Paragraph,
  Headline,
  Switch,
  Title,
  TouchableRipple
} from 'react-native-paper';
import io from 'socket.io-client';

const socket = io("http://192.168.1.8:2500");



function myXOR(a,b) {
		return ( a || b ) && !( a && b );
}

class SensorBugVisual extends Component{
	
	constructor(props){
		super(props);

		this.state = {
			name: 'Bug',
			garden: undefined,
			hide: true,
			hideOthers: false,
			light: false,
			fan: false,
			night_time: 8,
			spinAnim: new Animated.Value(0)
			
		}
		// this.spin = this.state.spinAnim.interpolate({
		// 	inputRange: [0, 1],
		// 	outputRange: ['0deg', '360deg']
		// })
		this.onChangeName = this.onChangeName.bind(this);
		this.LightHandle = this.LightHandle.bind(this);
		this.FanHandle = this.FanHandle.bind(this);
		this.clickHandle = this.clickHandle.bind(this);
		this.showSun = this.showSun.bind(this);
		this.lightOn = this.lightOn.bind(this);
		this.textColor = this.textColor.bind(this);
		this.runAnimation = this.runAnimation.bind(this);
		this.animationHandle = this.animationHandle.bind(this);

		// this.state.name = this.props.name;
		console.log(this.state);

		this.state.garden = this.props.garden;
		this.state.name = this.props.message.name;
		this.state.light = this.props.message.light;
		this.state.fan = this.props.message.fan;
		this.state.night_time = this.props.message.night;

		
	}
	
	render() {
		
		let {name, garden, hide, occ} = this.state;
		console.log("cose "+ name, garden, hide, this.state.hideOthers);				

		

		// alert((this.state.hide.toString()+ this.state.hideOthers.toString()));

		return(
			<View>
				{(this.state.hide && !this.state.hideOthers) ? (
					<TouchableRipple onPress={this.clickHandle} rippleColor="rgba(0.7, 0.5, 0, 0.32)" >
						<Card style={[styles.sensorBugSmall, this.lightOn()]}>
						
							<Card.Title titleStyle={ this.lightOn()} title={this.state.name} />

							<Card.Content>
								<View style={styles.sensorStatus}>
									<Temp value={this.props.message.temp} text={this.textColor()}/>
									<Hum value={this.props.message.hum} text={this.textColor()}/>
									<Soil value={this.props.message.soil} text={this.textColor()}/>
								</View>
								{this.showDetail()}
							
							</Card.Content>
			
						</Card>
					</TouchableRipple>
				) : null
			}
			{(!this.state.hide && this.state.hideOthers) ? (
				
				<Card style={[styles.sensorBugBig, this.lightOn()]}>
					
					<Card.Title titleStyle={ this.lightOn()} title={this.state.name} 
								right={(props)=><TextInput id='name-input' onChangeText={text => this.onChangeName(text)} 
												value={this.state.text} placeholder='Cambia nome al Bug'
												mode='outlined'/>}
								rightStyle={{margin:10,width:'70%'}} />
				
					<Card.Content>
					{this.showDetail()}
						<View style={styles.sensorStatus}>
							<Temp value={this.props.message.temp} text={this.textColor()}/>
							<Hum value={this.props.message.hum} text={this.textColor()}/>
							<Soil value={this.props.message.soil} text={this.textColor()}/>
						</View>
						
					
					</Card.Content>
					<Card.Actions style={{justifyContent:'center'}}>
						<Button mode='contained' onPress={this.clickHandle}>
							Return
						</Button>
					</Card.Actions>
				</Card>
								
				) : null
			}
			</View>
		)
	}
	
	lightOn(){
		if(this.state.light===false){
			return {backgroundColor:'#46487e', color:'white'}
		}
	}
	textColor(){
		if(this.state.light===true){
			return('black');
		}else{
			return('white');
		}
	}

	runAnimation() {
		
	}

	animationHandle(){
		this.state.spinAnim.setValue(0);
		// this.spin = this.state.spinAnim.interpolate({
		// 	inputRange: [0, 1],
		// 	outputRange: ['0deg', '360deg']
		// })	
		Animated.timing(
			this.state.spinAnim,
		{
			toValue: 1,
			duration: 3000,
			easing: Easing.linear,
			useNativeDriver: true
		}
		).start((o) => {
			if(o.finished){
				this.animationHandle()
			}
		});
	}
	
     
	LightHandle(){
		//aggiorna base
		console.log('Current '+this.state.light);
		socket.emit("light",[this.state.name, !this.state.light]);
		
		if(this.state.light===false){
			this.setState({
				light: true
				});		
		}else{
			this.setState({
			light: false
			});		
		}			
    }
      
	FanHandle(){
		//aggiorna base
		console.log('Current '+this.state.fan);
		socket.emit("fan",[this.state.name, !this.state.fan]);

		if(this.state.fan===false){
			this.setState({fan: true});
			this.animationHandle();		
		}else{
			this.setState({
			fan: false
			});		
			this.state.spinAnim.setValue(1);
		}
		
		
		
	}
	  
	showSun() {
        if(this.state.light){
        	return(
          		<Image source={require('./img/icons8-sun-star-50.png')} />
          	)
        }else{
          	return(
          		<Image source={require('./img/icons8-luna-50.png')} />
          	)
        }
           
	}
	
	showDetail() {
		
		if(this.state.fan===true){
			this.animationHandle();		
		}else{
				
			this.state.spinAnim.setValue(1);
		}
		const spin = this.state.spinAnim.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		})
		
		if(this.state.hide===false){
			return(
				<View>
					
					<View style={styles.row}>
						<Subheading style={this.lightOn()}>
							Light
						</Subheading>
						<View>
							{this.showSun()}
						</View>
						<Switch value={this.state.light} onValueChange={this.LightHandle} />
					</View>
					<View style={styles.row}>
						<Subheading style={[{marginRight:18}, this.lightOn()]}>
							Fan 
						</Subheading>
						<Animated.Image style={{transform: [{rotate:spin}]}} source={require('./img/icons8-fan-50.png')} />
						
						<Switch value={this.state.fan} onValueChange={this.FanHandle} />  
					</View>
				</View>
				)
			}else{
				return
			}
	}
	// prova() {
	// 	if(this.state.fan){
			
	// 		this.state.spinAnim.setValue(0);
			
			
	// 	}else{
	// 		this.state.spinAnim.setValue(1);
	// 	}
		
	// }
	
	clickHandle(){
		this.props.action(!this.state.hideOthers);
		console.log('hide ',this.state.hide);

		this.setState({
			hide: !this.state.hide,
			hideOthers: !this.state.hideOthers
		});

		// console.log('hide ',this.state.hide);
		// alert(this.state.hideOthers);
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(this.props);
		if(this.props==prevProps){
		}else{
			this.setState({
				hideOthers: this.props.hideOthers
			})
		}
		// console.log(this.state);
	}
	// componentDidUpdate() {
	// 	if(this.state.fan===true){
	// 		this.animationHandle();		
	// 	}else{
				
	// 		this.state.spinAnim.setValue(1);
	// 	}
	// }

	get_connect_state(){
		
		if(this.state.connected){
			return('YEs')
		}else{
			return('NO')
		}
	}
	onChangeName(newName){
		//aggiorna base
		this.setState({
			name: newName
		});
	}

}
		

class GrowSetup extends Component{
	//chiamata al costruttore generica con assegnamento dei parametri di stato
	constructor(props){
		super(props);
		
		this.state = {
			//parametri dello stato del componente
			name: 'None',
			bugs_number: 0,
			hideOthers: false
		}
		this.state.name = this.props.name;
		this.state.bugs_number = this.props.numBugs;
		this.handler = this.handler.bind(this);
		// this.props.children.set_hide = this.props.children.set_hide.bind(this);

	}

	render() {
		//assegnamo le variabili con scope limitato alla funzione di render
		//allo stato dell'oggetto GrowSetup, che ha due parametri 
		let { name, bugsN } = this.state;

		//PER CREARE FIGLI SENZA PARAMETRI
		var children = Children.map(
			this.props.children, function(child) {
				return <View>{child}</View>;
			}
		);
		//PER CREARE FIGLI PASSANDO PARAMETRI
		const childrenWithProps = Children.map(this.props.children, child => 
				
			cloneElement(child, { garden: this.state.name,
										action: this.handler ,
										hideOthers: this.state.hideOthers})
			
			);

		console.log('child',childrenWithProps)
		//nella return va la sezione HTML con le variabili {variabile}
		return(
			<View  style={styles.app}>
				<Appbar.Header style={{ backgroundColor: 'lightgreen' }}>
					<Appbar.Content title={this.state.name}
									subtitle={(!this.state.hideOthers) ? (
										<Text>
											number of Bugs Detected: {this.state.bugs_number}
										</Text>
									): null }/>

				</Appbar.Header>
				
					<ScrollView >
						<View  style={styles.garden}>
							<View>{childrenWithProps}</View>
						</View>
					</ScrollView>
				
			</View>
			)

	}

	componentDidUpdate(prevState, prevProps) {
		// console.log(prevState);
		// console.log(this);
	}

	handler(data) {
		console.log("data from child", data);
		this.setState({
			hideOthers: data
		});
		
		return(data);
		
	}	

}

class App extends Component {
	constructor() {
		super();
		this.state = {
			response: false,
			endpoint: "http://192.168.1.8:2500"
		};
	}

	componentDidMount() {
		const { endpoint } = this.state;
		socket.on("update", data => this.setState({ response: data }));
	}

	render() {
		const items = [];
		const sensors = this.state.response;
		console.log(sensors);
		let bugNum = 0;

		if(sensors != false){
			
			sensors.map((item,index)=>{
				items.push(<SensorBugVisual message={item} key={index} />)
				bugNum = index;
			});
			
			console.log("ITEMS",items);
			return (
				<GrowSetup name='FirstGrow' numBugs={bugNum+1}>
					{items}
				</GrowSetup>
	
				// <View style={styles.sensorBugSmall}/>
			);
		}else{
			return(null)
		}
		
	}
}
const Temp = props => { 
	return (<View style={styles.sensorItem} >
				<Image source={require('./img/icons8-temperatura-50.png')} style={{ bottom:3}}/>
				<Subheading style={{position: 'absolute', right:2, color:props.text}}>{props.value}°C</Subheading>
			</View>);
};
const Hum = props => { 
	return (<View style={styles.sensorItem}>
				<Image source={require('./img/icons8-umidità-50.png')} style={{position: 'absolute', left:8}}/>
				<Subheading style={{position: 'absolute', right:2, color:props.text}}>{props.value}%</Subheading>
			</View>);
};
const Soil = props => { 
	return (<View style={styles.sensorItem}>
				<Image source={require('./img/icons8-soil-50.png')} style={{ bottom:5}}/>
				<Subheading style={{position: 'absolute', right:8, color:props.text}}>{props.value}%</Subheading>
			</View>);
};


const styles = StyleSheet.create({
  app: {
    display:'flex'
  },
  garden: {
    display: 'flex',
    flex: 1,
    justifyContent:'space-between',
    alignItems:'stretch',
    marginBottom: 50
  },
  
  row: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingTop:16,
    paddingHorizontal:16,
    width:'100%'
  },

  gardenHead: {
	  
	  
  },
  sensorBugSmall:{
    padding: 1,
    margin:10
  },
  sensorBugBig:{
    backgroundColor:'lightgray',
    margin:10
  },
  sensorStatus: {
    display:'flex',
    justifyContent:'space-between',
    alignItems:'stretch',
	flexDirection:'row',
	paddingVertical:30
  },
  sensorItem: {
    margin:4,
    borderStyle:'solid',
    borderColor:'lightgray',
    borderWidth: 0,
    paddingLeft:'-10%',
    flex: 1,
    flexDirection: 'row',
    alignItems:'center'
  },
  scrollContainer: {
    flex:1
  }
});

export default App;

