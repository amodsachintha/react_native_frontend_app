import React, {Component} from 'react';
import { Layout, List, ListItem} from "react-native-ui-kitten";
import axios from 'axios';

export default class HistoryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            history: null
        };
        this.renderListItem = this.renderListItem.bind(this);
    }

    componentDidMount() {
        axios.get('http://192.168.1.50:2222/history').then(res => {
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
                <List data={this.state.history} renderItem={this.renderListItem}/>
            </Layout>
        )
    }
}