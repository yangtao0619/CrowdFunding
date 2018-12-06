pragma solidity ^0.4.24;

contract InvestorToFunding {
    //这个合约保存了所有投资者的投资关系
    mapping(address => address[]) investorToFundingsMap;

    //添加关系的函数
    function joinToAddressMap(address _sender, address _contractAddress) public {
        investorToFundingsMap[_sender].push(_contractAddress);
    }

    //查看关系的函数
    function getMyInvestedContracts(address _sender) public view returns (address[]){
        return investorToFundingsMap[_sender];
    }

}

contract Crowdfunding {
    //众筹的智能合约

    /*
    业务分析：
    1.首先这个合约存储一个众筹项目
    2.这个众筹项目需要的数据有：
        a.众筹的发起人
        b.单个众筹的金额
        c.众筹的目标金额
        d.众筹的结束时间
        e.参与众筹的人
    3.投资人参与众筹
    4.众筹失败退款
    5.辅助函数：得到当前合约的余额；得到指定索引的投资人
    6.花费请求
    7.批准花费请求
    8.完成花费请求
    9.权限控制

    */
    string public projectName;
    address public manager;
    uint256 public targetMoney;
    uint256 public everyMoney;
    uint256 public endTime;
    address[] allInvestors;
    //给所有的请求放在一个请求池子里面
    Request[] allRequests;

    InvestorToFunding iToF;
    //标记某个地址是否已经参与过投资
    mapping(address => bool) public hasInvetedAddress;

    // "阿尔法蛋",100000,100,3600
    constructor(string _projectName, uint256 _targetMoney, uint256 _everyMoney, uint256 _duration, address _manager, InvestorToFunding _iToF) public payable{
        manager = _manager;
        projectName = _projectName;
        targetMoney = _targetMoney;
        everyMoney = _everyMoney;
        endTime = block.timestamp + _duration;
        iToF = _iToF;
    }

    //投资人参与众筹
    function invest() public payable {
        require(msg.value == everyMoney);
        //将投资人放在列表中
        allInvestors.push(msg.sender);
        hasInvetedAddress[msg.sender] = true;

        //将该合约地址添加进去
        iToF.joinToAddressMap(msg.sender, address(this));
    }

    //众筹失败退款
    function refund() onlyManager public {
        //遍历账户
        for (uint256 i = 0; i < allInvestors.length; i++) {
            allInvestors[i].transfer(everyMoney);
            hasInvetedAddress[msg.sender] = false;
        }
    }


    enum RequestStatus{
        invoting, approved, finished
    }

    // 构建花费请求,这个请求是众筹发起人向各投资人提出的,内容较多,最好定义一个结构体
    struct Request {
        //买什么
        string goodsName;
        //接收人
        address receiver;
        //请求支付的金额
        uint256 cost;
        //请求需要每个投资投票才可以,所以有一个请求的状态,分别是 进行中,已批准,已完成
        RequestStatus status;
        //和投资人参与众筹一样,每个人只能参与一次投票
        mapping(address => bool) hasInvoted;
        //标记投票的人数
        uint256 invotedNumber;
    }

    //发起一个请求
    function request(string _goodsName, address _receiver, uint256 _cost) onlyManager public {
        Request memory req = Request({
            goodsName : _goodsName,
            receiver : _receiver,
            cost : _cost,
            status : RequestStatus.invoting,
            invotedNumber : 0
            });
        allRequests.push(req);
    }

    //投资人批准某个请求
    function approve(uint256 _requestIndex) public {
        //首先要保证调用这个函数的人是投资人之一
        require(hasInvetedAddress[msg.sender]);
        //并且它不能是已经投过票的人
        Request storage req = allRequests[_requestIndex];
        //如果是true表示投过票了
        require(!req.hasInvoted[msg.sender]);
        //还要判断一下,这个请求是否是已经完成的状态
        require(req.status == RequestStatus.invoting);
        //如果没有投过票的话,需要变化对应的状态
        req.invotedNumber += 1;
        //标记这个人已经投过票了
        req.hasInvoted[msg.sender] = true;
    }

    //手动支付一笔请求
    function finshRequest(uint256 _requestIndex) onlyManager public {
        //需要判断余额是否足够
        Request storage req = allRequests[_requestIndex];
        require(req.cost <= address(this).balance);
        //投票的人数超过投资人的半数
        require(req.invotedNumber * 2 > allInvestors.length);

        //给地址转账
        req.receiver.transfer(req.cost);
        //标记请求状态为已经完成
        req.status = RequestStatus.finished;
    }

    //查询某一请求的状态
    function getRequestStatus(uint256 _requestIndex) public view returns (RequestStatus){
        return allRequests[_requestIndex].status;
    }

    //权限控制,有些函数只能由合约发起人调用
    modifier onlyManager(){
        require(msg.sender == manager);
        _;
    }

    //返回当前合约账户的余额
    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    //返回所有的投资人
    function getAllInvestors() public view returns (uint256){
        return allInvestors.length;
    }

    //返回所有的请求数量
    function getAllRequetsCount() public view returns (uint256){
        return allRequests.length;
    }

    function getLeftTime() public view returns (uint256){
        return endTime - now;
    }

    //返回指定请求的详细信息
    function getRequetInfos(uint256 _requestIndex) public view returns (string, address, uint256, RequestStatus, uint256){
        Request storage req = allRequests[_requestIndex];
        return (req.goodsName, req.receiver, req.cost, req.status, req.invotedNumber);
    }

}
/*
合约工厂执行的功能:
1.创建一个众筹的合约
2.可以查看当前地址发起的所有众筹
3.查看该平台上的所有合约
4.查看当前地址参与的所有众筹
    a.每个平台要绑定一个保存了投资者->合约库的另一个合约
    b.平台创建的时候初始化这个合约
*/
contract FundingFactory {
    //每个地址对应的合约
    mapping(address => Crowdfunding[]) creatorCrowdfundings;
    //当前平台所有创建的合约
    Crowdfunding[] public allCrowdfundings;

    //平台的管理员
    address public platformManager;

    //itof合约实例
    InvestorToFunding public iToF;

    constructor() public{
        platformManager = msg.sender;

        //创建工厂的时候就应该实例化iToF对象
        InvestorToFunding temp = new InvestorToFunding();
        iToF = temp;
    }

    //创建一个合约
    function createNewFunding(string _projectName, uint256 _targetMoney, uint256 _everyMoney, uint256 _duration) public {
        Crowdfunding crowdFunding = new  Crowdfunding(
            _projectName,
            _targetMoney,
            _everyMoney,
            block.timestamp + _duration,
            msg.sender,
            iToF
        );
        //创建众筹之后,要把当前地址创建的众筹添加到map中
        creatorCrowdfundings[msg.sender].push(crowdFunding);

        //这样添加的manager有问题,会默认使用当前合约的地址给它赋值,所以要显示的给它传进去
        allCrowdfundings.push(crowdFunding);
    }

    //获取当前地址创建的所有众筹项目
    function getFundingsByAddres() public view returns (Crowdfunding[]){
        return creatorCrowdfundings[msg.sender];
    }

    //获取当前平台所有的合约
    function getAllFundingsOnPlatfrom() public view returns (Crowdfunding[]){
        return allCrowdfundings;
    }

    //获取当前地址参与过的所有合约
    function getInvestedFundingsByAddresss() public view returns(address[]) {
        return iToF.getMyInvestedContracts(msg.sender);
    }


}