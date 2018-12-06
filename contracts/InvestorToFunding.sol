pragma solidity ^0.4.24;

contract InvestorToFunding {
    //这个合约保存了所有投资者的投资关系
    mapping(address=>address[]) investorToFundingsMap;

    //添加关系的函数
    function joinToAddressMap(address _sender,address _contractAddress) public {
        investorToFundingsMap[_sender].push(_contractAddress);
    }

    //查看关系的函数
    function getMyInvestedContracts(address _sender) public view returns(address[]){
        return investorToFundingsMap[_sender];
    }

}