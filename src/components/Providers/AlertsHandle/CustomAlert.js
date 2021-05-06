// CustomAlert.js
import { Component } from 'react'
import { withAlert } from 'react-alert'
 
class CustomAlert extends Component  {

    constructor(props) {
        super(props)
        this.updateAlert = this.updateAlert.bind(this)
    }

    componentDidMount() {
        this.updateAlert(this.props)
    }

  updateAlert(properties){
    if(properties.tipoAlert==="success")
        properties.alert.success(properties.msg)
    else if(properties.tipoAlert==="error")
        properties.alert.error(properties.msg)
    else if(properties.tipoAlert==="warning")
        properties.alert.warning(properties.msg)
    else if(properties.tipoAlert==="info")
        properties.alert.info(properties.msg)
    properties.callback()
  }


    // componentWillReceiveProps = (nextProps) => {
    //     this.updateAlert(nextProps)
    // }   

    // componentWillUpdate(){
        // this.props.callback()
    // }

    componentDidUpdate(){
        // this.props.callback()
        this.updateAlert(this.props)
    }
  
  render () {
    return null
  }
}
 
export default withAlert(CustomAlert)