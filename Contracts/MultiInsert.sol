pragma solidity ^0.4.24;

contract MultiInsert {
    mapping(address=>bool) any;
    
    function setClaimers(address[] memory _claimers) public {
       for(uint i =0 ;i < _claimers.length ; i++) {
           address claimer = _claimers[i];
           any[claimer] = true;
       }
    }
    
     function getClaimer(address _claimer) public view returns(bool) {
        return any[_claimer];
    }
}