import web3 from './web3';
import Factory from './artifacts/contracts/Campaign.sol/Factory.json';

let instance;
if (typeof web3 !== "undefined") {

    instance = new web3.eth.Contract( 
        Factory.abi,
        "0x52c9D87B71A92EecF0b0cE6054C2D1216b22B592"
     );
}

 export default instance;