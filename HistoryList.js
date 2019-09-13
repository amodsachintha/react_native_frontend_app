import React, {Component} from 'react';
import {Button, Layout, List, ListItem} from "react-native-ui-kitten";
import axios from 'axios';
import config from './config';

export default class HistoryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            history: null
        };
        this.renderListItem = this.renderListItem.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList(){
        axios.get(`http://${config.remote_server}:${config.remote_port}/history`).then(res => {
            this.setState({history: res.data.data});
        }).catch(e => {
            alert(e.toString());
        });
    }

    renderListItem(data) {
        return (
            <ListItem
                title={`❗${data.item.pred_class} at ${data.item.accuracy}% accuracy`}
                description={`${data.item.province} for ${data.item.day}, ${data.item.month}`}
                onPress={() => {
                    this.props.clickHandler(data.item, 2);
                }}
            />
        )
    }

    render() {
        return (
            <Layout>
                <Button onPress={this.refreshList} appearance='outline' status='success'>refresh</Button>
                <List data={this.state.history} renderItem={this.renderListItem} style={{marginTop: 2}}/>
            </Layout>
        )
    }
}