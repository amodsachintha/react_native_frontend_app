import React, {Component} from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import {ApplicationProvider, Layout, Text, TabView, Tab, Button, Avatar, Select, ListItem, Spinner} from 'react-native-ui-kitten';
import {mapping, light as theme} from '@eva-design/eva';
import axios from 'axios';
import HistoryList from "./HistoryList";
import config from './config';

class App extends Component {

    constructor(props) {
        super(props);
        this.months = [
            {text: 'January', value: 1},
            {text: 'February', value: 2},
            {text: 'March', value: 3},
            {text: 'April', value: 4},
            {text: 'May', value: 5},
            {text: 'June', value: 6},
            {text: 'July', value: 7},
            {text: 'August', value: 8},
            {text: 'September', value: 9},
            {text: 'October', value: 10},
            {text: 'November', value: 11},
            {text: 'December', value: 12},
        ];
        this.provinces = [
            {text: 'Northern Province', value: 1},
            {text: 'North Western Province', value: 2},
            {text: 'Western Province', value: 3},
            {text: 'North Central Province', value: 4},
            {text: 'Central Province', value: 5},
            {text: 'Sabaragamu Province', value: 6},
            {text: 'Eastern Province', value: 7},
            {text: 'Uva Province', value: 8},
            {text: 'Southern Province', value: 9},
        ];
        this.days = [
            {text: 'Monday', value: 1},
            {text: 'Tuesday', value: 2},
            {text: 'Wednesday', value: 3},
            {text: 'Thursday', value: 4},
            {text: 'Friday', value: 5},
            {text: 'Saturday', value: 6},
            {text: 'Sunday', value: 7}
        ];

        this.state = {
            tabIndex: 0,
            selectedMonth: null,
            selectedProvince: null,
            selectedDay: null,
            selectStatus: 'primary',
            selectedHistoryItem: null,
            isLoading: false
        };
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectProvince = this.onSelectProvince.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.doPost = this.doPost.bind(this);
        this.setSelectedHistoryItem = this.setSelectedHistoryItem.bind(this);
        this.renderHistoryItem = this.renderHistoryItem.bind(this);
    }

    onSelectOption(tabIndex) {
        this.setState({tabIndex})
    };

    onSelectDay(selectedDay) {
        this.setState({selectedDay});
        this.setState({selectStatus: 'primary'});
    }

    onSelectMonth(selectedMonth) {
        this.setState({selectedMonth});
        this.setState({selectStatus: 'primary'});
    }

    onSelectProvince(selectedProvince) {
        this.setState({selectedProvince});
        this.setState({selectStatus: 'primary'});
    }

    doPost() {
        if (this.state.selectedProvince && this.state.selectedMonth && this.state.selectedDay) {
            this.setState({isLoading: true});
            axios.post(`http://${config.remote_server}:${config.remote_port}/predict`, {
                day: this.state.selectedDay,
                month: this.state.selectedMonth,
                province: this.state.selectedProvince
            }).then(res => {
                ToastAndroid.show('Success!', ToastAndroid.SHORT);
                alert(`Predicted ${res.data.data.class} with ${res.data.data.accuracy}% accuracy`);
                this.setState({isLoading: false});
            }).catch(e => {
                ToastAndroid.show('error', ToastAndroid.SHORT);
                alert(e.toString());
                this.setState({isLoading: false});
            });

        } else {
            ToastAndroid.show('Select each field to submit prediction request!', ToastAndroid.LONG);
            this.setState({selectStatus: 'danger'});
        }
    }

    setSelectedHistoryItem(item, tabIndex) {
        this.setState({selectedHistoryItem: item, tabIndex})
    }

    renderHistoryItem() {
        if (this.state.selectedHistoryItem) {
            let {selectedHistoryItem} = this.state;
            return (
                <Layout>
                    <Text
                        style={{textAlign: 'center'}}
                        appearance='hint'
                        category='h3'
                        status='success'>
                        #ID - {selectedHistoryItem.id}
                    </Text>
                    <Text
                        style={{textAlign: 'center'}}
                        appearance='alternative'
                        category='p1'
                        status='primary'>
                        Requested on {selectedHistoryItem.created_at}
                    </Text>

                    <ListItem
                        title={`${selectedHistoryItem.pred_class}`}
                        description='- Predicted Class'/>
                    <ListItem
                        title={`${selectedHistoryItem.accuracy}`}
                        description='- Predicted Accuracy'/>
                    <ListItem
                        title={`${selectedHistoryItem.province}`}
                        description='- Province'/>
                    <ListItem
                        title={`${selectedHistoryItem.day}`}
                        description='- Day'/>
                    <ListItem
                        title={`${selectedHistoryItem.month}`}
                        description='- Month'/>
                </Layout>
            )
        } else {
            return (<Text style={{textAlign: 'center'}}>Nothing Selected!</Text>)
        }
    }


    render() {
        return (
            <ApplicationProvider mapping={mapping} theme={theme}>
                <TabView selectedIndex={this.state.tabIndex} onSelect={this.onSelectOption}>
                    <Tab title='Get Prediction'>
                        <Layout style={styles.container}>

                            <Layout style={{alignItems: 'center', marginBottom: 20, marginTop: 12}}>
                                <Avatar
                                    source={{uri: 'https://www.cisco.com/c/en/us/products/security/machine-learning-security/_jcr_content/Grid/subcategory_atl/layout-subcategory-atl/anchor_info_127c/image.img.jpg/1559195192399.jpg'}}
                                    size='large'
                                    shape='rounded'
                                />
                                <Text style={{marginTop: 5}}>Crime Prediction</Text>
                            </Layout>

                            <Select data={this.provinces} placeholder='Select Province' style={{paddingBottom: 15}}
                                    selectedOption={this.state.selectedProvince} label='Province'
                                    onSelect={this.onSelectProvince} status={this.state.selectStatus}/>

                            <Select data={this.months} placeholder='Select Month' style={{paddingBottom: 15}}
                                    selectedOption={this.state.selectedMonth} label='Month'
                                    onSelect={this.onSelectMonth} status={this.state.selectStatus}/>

                            <Select
                                data={this.days} placeholder='Select Day' style={{paddingBottom: 15}}
                                selectedOption={this.state.selectedDay} label='Day'
                                onSelect={this.onSelectDay} status={this.state.selectStatus}/>

                            <Button onPress={this.doPost} status='danger' appearance='outline' disabled={this.state.isLoading}>
                                Get Prediction
                            </Button>

                            <Layout style={{alignItems: 'center', marginTop: 20}}>
                                {this.state.isLoading ? <Spinner status='warning' size='giant'/> : null}
                            </Layout>
                        </Layout>
                    </Tab>
                    <Tab title='History'>
                        <Layout style={{padding: 5}}>
                            <HistoryList clickHandler={this.setSelectedHistoryItem}/>
                        </Layout>
                    </Tab>
                    <Tab title='Info'>
                        <Layout style={{padding: 30}}>
                            {this.renderHistoryItem()}
                        </Layout>
                    </Tab>
                </TabView>
            </ApplicationProvider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 25,
    },
    text: {
        textAlign: 'center',
    },
});

export default App;
