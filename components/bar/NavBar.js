import React, { useEffect, useReducer, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./index.module.scss";
import Link from "next/link";
import { useAccount, useContractRead } from "wagmi";
import nextConfig from "../../next.config.js";
import EZSwapPioneer from "../../pages/data/ABI/EZSwapPioneer.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGlobe, faXmark } from "@fortawesome/free-solid-svg-icons";
import PopupBlurBackground from "../collection/PopupBlurBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import { queryUserAllNFT } from "../../pages/api/ipfs";
import Image from "next/image";

const NavBar = () => {
  const [addressInfo, setAddressInfo] = useState({});
  const [sendGetScore, setSendGetScore] = useState(0);
  const [userHavePoineerCount, setUserHavePoineerCount] = useState(0);
  const [airdropJumpUrl, setAirdropJumpUrl] = useState("");
  const [launchpadJumpUrl, setLaunchpadJump] = useState("");
  const [mainPageJumpUrl, setMainPageJumpUrl] = useState("");
  const { address: owner } = useAccount();
  const [showLanguages, setShowLanguages] = useState(false);
  const [enteredDropdown, setEnteredDropdown] = useState(false);

  const { lanMap, switchLanguage, languageModel, chosenLanguage } =
    useLanguage();
  const [toggleHamburger, setToggleHamburger] = useState(false);
  const [hamburgerShowLanguage, setHamburgerShowLanguage] = useState(false);

  // const {data: nftApprovalData} = useContractRead({
  //     address: '0x670d854c7da9e7fa55c1958a1aeb368b48496020',
  //     abi: EZSwapPioneer,
  //     functionName: 'balanceOf',
  //     args: [owner],
  //     watch: true,
  //     onSuccess(data) {
  //         console.log('查询pass卡:', data)
  //         setUserHavePoineerCount(data.toNumber())
  //     },
  //     onError(err) {
  //         console.log(err, owner)
  //     }
  // })

  // useEffect(() => {
  //   const fetchData = async () => {
      // const params = {
      //   address: owner?.toLowerCase(),
      //   mode: "pro",
      // };
      // const response = await fetch("/api/queryAddressScore", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(params),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   let userScore = data.data;
      //   setAddressInfo(userScore);
      // }
      // 查询是否有pass卡
      // const params2 = {
      //   owner: owner?.toLowerCase(),
      //   mode: "pro",
      // };
      // const result = await queryUserAllNFT(
      //   owner,
      //   "0x670d854C7Da9E7Fa55c1958A1AeB368B48496020"
      // );
      // if (result.ownedNfts.length > 0) {
      //   setUserHavePoineerCount(result.ownedNfts.length);
      // } else {
      //   setUserHavePoineerCount(0);
      // }
    // };
    // if (owner) fetchData();
  // }, [owner]);

  useEffect(() => {
    const isProd = nextConfig.publicRuntimeConfig.env.API === "dev2";
    if (isProd) {
      setAirdropJumpUrl("https://ezswap.io/#/event/airdropOverview");
      setLaunchpadJump("https://launchpad.ezswap.io/#/launchpadList");
      setMainPageJumpUrl("https://ezswap.io");
    } else {
      setAirdropJumpUrl("https://test.ezswap.io/#/event/airdropOverview");
      setLaunchpadJump("https://test.ezswap.io/#/launchpadList");
      setMainPageJumpUrl("https://test.ezswap.io");
    }
  });

  const svgSuccess = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 stroke-current shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const [alertText, setAlertText] = useState({
    className: "",
    text: "",
    svg: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  function showSuccessAlert(msg) {
    setAlertText({
      className: "alert-success",
      text: msg,
      svg: svgSuccess,
    });
    setShowAlert(true);
  }
  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  const goClaim = async () => {
    showSuccessAlert("Coming Soon!");
  }


  const handleClick = async (item) => {
    if (item === 1) {
      if (addressInfo.todayPunch === 1) {
        return;
      }
      window.open(
        "https://twitter.com/intent/tweet?text=Today marks day " +
          (addressInfo.punchCount + 1) +
          " of my daily attendance for EZswap. Get ur $EZ here: https://ezswap.io/%23/event/airdropOverview?inviteAddress=" +
          owner,
        "_blank"
      );
      // 打卡
      const params = { address: owner?.toLowerCase() };
      const response = await fetch("/api/addressPunch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data.success) {
        showSuccessAlert("Punch Success");
        addressInfo.score = addressInfo.score + data.data;
        addressInfo.todayPunch = 1;
        setAddressInfo(addressInfo);
        setSendGetScore(data.data);
        my_modal_2.showModal();
      }
    } else if (item === 2) {
      const isProd = nextConfig.publicRuntimeConfig.env.API === "dev2";
      if (isProd) {
        navigator.clipboard.writeText(
          "https://ezswap.io/#/event/airdropOverview?inviteAddress=" +
            owner?.toLowerCase()
        );
      } else {
        navigator.clipboard.writeText(
          "https://test.ezswap.io/#/event/airdropOverview?inviteAddress=" +
            owner?.toLowerCase()
        );
      }
      showSuccessAlert("Copy Success");
    }
  };

  const handleLanguageSelection = (lan) => {
    switchLanguage(lan);
  };

  const HamburgerNavBar = () => (
    <div className="relative flex items-center justify-between w-full h-full px-4 py-2 m-auto sm:hidden">
      <Link href="/">
        <Image src="/1500X500WhiteHalfHorizontal.svg" alt="EZswap" width={135} height={38} />
      </Link>
      <button
        onClick={() => {
          setToggleHamburger((ham) => !ham);
          setHamburgerShowLanguage(false);
        }}
        className="text-white duration-300 ease-in focus:outline-none lg:hidden"
      >
        {toggleHamburger ? (
          <FontAwesomeIcon icon={faXmark} size="xl" />
        ) : (
          <FontAwesomeIcon icon={faBars} size="xl" />
        )}
      </button>

      {/* HamburgerButton Dropdown */}
      <div
        className={`${
          toggleHamburger ? "flex" : "hidden"
        } flex-col absolute w-full top-[80px] left-0 bg-black justify-start items-end gap-3 min-h-[60vh] px-6`}
      >
        <Link
          className="w-full p-2 text-xl font-bold text-right border-b-2 hover:bg-zinc-800"
          href="/swap"
          onClick={() => {
            setToggleHamburger(false);
            setHamburgerShowLanguage(false);
          }}
        >
          {languageModel.swap}
        </Link>
        <Link
          className="w-full p-2 text-xl font-bold text-right border-b-2 hover:bg-zinc-800"
          href="/collection"
          onClick={() => {
            setToggleHamburger(false);
            setHamburgerShowLanguage(false);
          }}
        >
          {languageModel.pool}
        </Link>
        <Link
          className={`w-full p-2 text-xl font-bold text-right hover:bg-zinc-800 border-b-2`}
          href="/mypool"
          onClick={() => {
            setToggleHamburger(false);
            setHamburgerShowLanguage(false);
          }}
        >
          {languageModel.myPool}
        </Link>
        <Link
            className={`w-full p-2 text-xl font-bold text-right hover:bg-zinc-800 border-b-2`}
            href="/airdropclaim"
            onClick={() => {
              setToggleHamburger(false);
              setHamburgerShowLanguage(false);
            }}
        >
          Airdrop
        </Link>
        {/*放开*/}
        <Link
            className={`w-full p-2 text-xl font-bold text-right hover:bg-zinc-800 border-b-2`}
            href="/staking"
            onClick={() => {
              setToggleHamburger(false);
              setHamburgerShowLanguage(false);
            }}
        >
          Staking
        </Link>
        {/*放开*/}
        {/*<div*/}
        {/*    className={`w-full p-2 text-xl font-bold text-right hover:bg-zinc-800 border-b-2`}*/}
        {/*    onClick={() => {*/}
        {/*      setToggleHamburger(false);*/}
        {/*      setHamburgerShowLanguage(false);*/}
        {/*    }}*/}
        {/*>*/}
        {/*  Launchpad(Coming)*/}
        {/*</div>*/}



        {/*放开*/}
        <Link
            className={`w-full p-2 text-xl font-bold text-right hover:bg-zinc-800 border-b-2`}
            href="/launchpad"
            onClick={() => {
              setToggleHamburger(false);
              setHamburgerShowLanguage(false);
            }}
        >
          Launchpad
        </Link>
        {/*放开*/}
        {/*</Link>*/}
        <ConnectButton />
      </div>
    </div>
  );

  return (
    <div className={`${styles.wrapNewHeader} `}>
      {/* Mobile Hamburger Navbar */}
      <HamburgerNavBar />

      {/* Usual Navbar */}
      <div className={`${styles.headerBox} hidden sm:flex`}>
        <div className={styles.ezLogo}>
          <Link href="/">
            <img src="/1500X500WhiteHalfHorizontal.svg" alt="EZswap" />
          </Link>
        </div>

        <div
          className={`${styles.headerLeft} ${
            chosenLanguage === "jp" ? "text-sm" : "text-base"
          }`}
        >
          {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Search</a>*/}
          <Link
            className={styles.headerBtn + " " + styles.launchpad}
            href="/swap"
          >
            {languageModel.swap}
          </Link>
          <Link
            className={styles.headerBtn + " " + styles.launchpad}
            href="/collection"
          >
            {languageModel.pool}
          </Link>
          {/*<a*/}
          {/*  className={styles.headerBtn + " " + styles.launchpad}*/}
          {/*  href={launchpadJumpUrl}*/}
          {/*  target="_blank"*/}
          {/*>*/}
          {/*  {languageModel.mint}*/}
          {/*</a>*/}
          <Link
            className={styles.headerBtn + " " + styles.launchpad}
            href='/airdropclaim'
            target="_self"
          >
            Airdrop
          </Link>
          {/*放开*/}
          <Link
            className={styles.headerBtn + " " + styles.launchpad}
            href='/staking'
            target="_self"
          >
            Staking
          </Link>
          {/*放开*/}
          {/*<div className={styles.headerBtn + " " + styles.launchpad}>*/}
          {/*  Launchpad(Coming)*/}
          {/*</div>*/}
          {/*放开*/}
          <Link
              className={styles.headerBtn + " " + styles.launchpad}
              href='/launchpad'
              target="_self"
          >
            Launchpad
          </Link>
          {/*放开*/}

          {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad} href='https://ezswap.readme.io/reference/overview'target="_blank">API</a>*/}
          {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Buy/Sell Crypto</a>*/}
        </div>
        <div className={styles.headerRight}>
          {/*<div className={styles.headerBtn + " " + styles.rightBtn}>My NFT</div>*/}
          <Link
            className={`${styles.headerBtn} + " " + ${styles.rightBtn}  ${
              chosenLanguage === "jp" ? "text-sm" : "text-base"
            }`}
            href="/mypool"
          >
            {languageModel.myPool}
          </Link>
          <div
            id="languageSelection"
            className={`relative `}
            onMouseEnter={() => setShowLanguages(true)}
            onMouseLeave={() => setShowLanguages(false)}
          >
            <FontAwesomeIcon
              icon={faGlobe}
              size="xl"
              className="cursor-pointer"
            />
            <div
              className={`absolute min-w-[120px] max-h-[230px] -translate-x-[40%] -translate-y-10 ${
                showLanguages ? "" : "hidden"
              }`}
            >
              <div id="empty_space" className="h-[60px]"></div>
              <div
                className={` bg-white rounded-md py-2 flex flex-col justify-start items-start gap-1 `}
              >
                {Object.keys(lanMap).map((lan) => (
                  <button
                    key={lan}
                    className="w-full h-8 capitalize text-slate-950 hover:bg-gray-200"
                    onClick={() => handleLanguageSelection(lan)}
                  >
                    {lanMap[lan].name}
                  </button>
                ))}
                {/* <button
                  className="w-full h-8 text-red-700 capitalize border-t-2 hover:bg-gray-200 drop-shadow-md"
                  onClick={() => setShowLanguages(false)}
                >
                  {languageModel.Close}
                </button> */}
              </div>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>

      {showAlert && (
        <div className={styles.alertPosition}>
          <div
            className={
              "alert" + " " + alertText.className + " " + styles.alertPadding
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 stroke-current shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alertText.text}</span>
          </div>
        </div>
      )}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <p className="py-4 text-2xl">
            {languageModel.Congrats}
            {(chosenLanguage === "en" || chosenLanguage === "cn") &&
              languageModel.YouGet + " "}
            :
            <span className={styles.getScore}>
              {" "}
              {sendGetScore} {languageModel.Points}
              {(chosenLanguage === "jp" ||
                chosenLanguage === "kr" ||
                chosenLanguage === "tr") &&
                " " + languageModel.YouGet}
            </span>
          </p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>{languageModel.Close}</button>
        </form>
      </dialog>
    </div>
  );
};

export default NavBar;
