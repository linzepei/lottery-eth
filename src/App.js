import React, {Component} from 'react';
import CardExampleCard from './display/ui'

let web3 = require('./utils/InitWeb3');
let lotteryInstance = require('./eth/Lottery')

class App extends Component {

    play = async () => {
        console.log('play Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({isClicked: true})
        let accounts = await web3.eth.getAccounts()
        try {
            await lotteryInstance.methods.play().send({
                from: accounts[0],
                value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            window.location.reload(true)
            this.setState({isClicked: false})
            alert('投注成功')
        } catch (e) {
            console.log(e)
            this.setState({isClicked: false})
            alert('投注失败')
        }
    }
    kaijiang = async () => {
        console.log('kaijiang Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({isClicked: true})
        let accounts = await web3.eth.getAccounts()
        try {
            await lotteryInstance.methods.kaijiang().send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            //显示中奖人
            let winner = await lotteryInstance.methods.winner().call()
            window.location.reload(true)
            this.setState({isClicked: false})
            alert(`开奖成功!\n中奖人: ${winner}`)
        } catch (e) {
            console.log(e)
            this.setState({isClicked: false})
            alert('开奖失败')
        }
    }
    tuijiang = async () => {
        console.log('tuijiang Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({isClicked: true})
        let accounts = await web3.eth.getAccounts()
        try {
            await lotteryInstance.methods.tuijiang().send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            window.location.reload(true)
            this.setState({isClicked: false})
            alert('退奖成功')
        } catch (e) {
            console.log(e)
            this.setState({isClicked: false})
            alert('退奖失败')
        }
    }

    constructor() {
        super()
        this.state = {
            manager: '',
            round: '',
            winner: '',
            playerCounts: 0,
            balance: 0,
            players: [],
            currentAccount: '',
            isClicked: false,
            isShowButton: '',
        }
    }

    componentDidMount() {

    }

    async componentWillMount() {
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        let manager = await lotteryInstance.methods.manager().call()
        let winner = await lotteryInstance.methods.winner().call()
        let round = await lotteryInstance.methods.round().call()
        let playerCounts = await lotteryInstance.methods.getPlayersCount().call()
        //单位是wei，需要转换为eth单位
        let balanceWei = await lotteryInstance.methods.getBalance().call()
        //从wei单位转换为eth
        let balance = web3.utils.fromWei(balanceWei, 'ether')
        let players = await lotteryInstance.methods.getPlayers().call()
        //是否显示管理员按钮
        let isShowButton = accounts[0] === manager ? 'inline' : 'none'
        this.setState({
            // manager: manager,
            manager,
            round,
            winner,
            playerCounts,
            balance,
            players,
            currentAccount: accounts[0],
            isClicked: false,
            isShowButton
        })
    }

    render() {
        let a = 'Sher'
        return (
            <div>
                <CardExampleCard
                    manager={this.state.manager}
                    round={this.state.round}
                    winner={this.state.winner}
                    balance={this.state.balance}
                    players={this.state.players}
                    playerCounts={this.state.playerCounts}
                    currentAccount={this.state.currentAccount}
                    play={this.play}
                    kaijiang={this.kaijiang}
                    tuijiang={this.tuijiang}
                    isClicked={this.state.isClicked}
                    isShowButton={this.state.isShowButton}
                />
            </div>
        );
    }
}

export default App;