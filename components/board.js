import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Button, Alert, Text } from 'react-native';

export default class Board extends Component {

    constructor(props){
        super(props);
        this.state = this.getDefaultState();
    }

    getDefaultState(){
        return {
            colorNow: 'blue',
            moves: 0,
            board: this.getEmptyBoard(),
            isGameOver: false
        }
    }

    getEmptyBoard(){
        let board = {};
        for(let i=0; i < 3; i++){
            for(let j=0; j < 3; j++){
                board[i*10+j] = 'white';
            }
        }
        return board;
    }

    checkWinner(lastMove, size=3){
        if(this.state.moves == size*size){
            return 'Nobody';
        }
        let {i, j, color} = lastMove;
        let ij = i*10+j;
        let checkOri = (ori)=>{
            let count = 0;
            let checkDir = (dir)=>{
                let moveCount = (dir == 1) ? 0 : 1;
                let cellij = ij+dir*moveCount*ori;
                while(this.state.board[cellij]){
                    if(this.state.board[cellij] == color){
                        count++;
                        // console.log(cellij, color, count, ori, dir);
                    }
                    moveCount++;
                    cellij = ij+dir*moveCount*ori;
                }
            }
            checkDir(1);
            checkDir(-1);
            return count;
        }
        let oris = [1, 10, 11, 9]
        for(let ori of oris){
            if(checkOri(ori) == size){
                return color;
            }
        }
        return false;
    }

    resetGame(title, msg){
        Alert.alert(
            title,
            msg,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {this.setState(this.getDefaultState())}
                },
            ],
            {cancelable: false},
        );
    }

    cellOnPress(i, j){
        let nextColor = {
            red: 'blue',
            blue: 'red'
        }

        if(this.state.board[i*10+j] == 'white' && !this.state.isGameOver){
            let lastMove = {
                i,j,
                color: this.state.colorNow
            }
            this.setState((prevState)=>{
                let board = {...prevState.board};
                let colorNow = nextColor[this.state.colorNow];
                board[i*10+j] = this.state.colorNow;
                let moves = this.state.moves + 1;
                return {board, colorNow, moves};
            },()=>{
                let winner = this.checkWinner(lastMove);
                if(winner){
                    this.setState({isGameOver: true},()=>{
                        this.resetGame('Game Over', winner.toUpperCase() + ' won!\nDo you want to reset the game?');
                    });
                }
            });
        }
        return false;
    }

    render(){
        let board = [];
        for(let i=0; i < 3; i++){
            let row = [];
            for(let j=0; j < 3; j++){
                row.push(
                    <TouchableOpacity key={j} style={[styles.box, {backgroundColor: this.state.board[i*10+j]}]} 
                        onPress={()=>{this.cellOnPress(i,j)}}>
                    </TouchableOpacity>
                );
            }
            board.push(
                <View key={i} style={styles.row}>
                    {row}
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.turnmsg}>
                    <Text>{this.state.colorNow.toUpperCase()}'s turn</Text>
                </View>
                <View style={styles.Button}>
                    <Button title='reset' onPress={
                        ()=>{this.resetGame.call(this, 'Reset', 'Are you sure you want to reset?')}
                    }/>
                </View>
                <View style={styles.board}>
                    {board}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        height: '90%',
        marginRight: '5%',
        aspectRatio: 1,
        borderColor: 'black',
        borderWidth: 2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    board: {
        width: '90%',
        aspectRatio: 1,
        top: '25%'
    },
    container: {
        flex: 1,
        alignItems: 'center'
    },
    Button: {
        top: '80%',
        width: '80%'
    },
    turnmsg: {
        top: '20%',
    }
});
