import React, { useEffect, useState } from "react";
import "./dino.css";
import Charecter from "./Charecter";
import { ethers } from "ethers";
import DinoToken from "../build/contracts/DinoToken.json";
import Web3 from "web3";

/*import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "wss://eth-goerli.ws.alchemyapi.io/v2/"
  );
  web3 = new Web3(provider);
}

export default web3; */
const Dino = () => {
  const dino1 = new Charecter("T-rex", 1, 0, stats);
  const [hasStarted, setHasStarted] = useState(false);
  const [earned, setEarned] = useState(false);
  const [defeated, setDefeated] = useState(false);
  const [points, setPoints] = useState(0);
  const [balanceDT, setBalanceDT] = useState(0);
  const [stats, setStats] = useState({
    earning: 1,
  });

  let web3 = new Web3(window.ethereum);
  const DAI_ADDRESS = "0x5E90C360fc8Cc93278303570E2d3fb86068b2c59";
  const daiToken = new web3.eth.Contract(DinoToken.abi, DAI_ADDRESS);
  const dino = document.getElementById("dino");
  const cactus = document.getElementById("cactus");
  const point = document.getElementById("point");
  const hostId = "0x4bf50a5ab4848539Bd071FC33981eEbb623652Ae";

  function jump() {
    if (dino?.classList != "jump") {
      dino?.classList.add("jump");

      setTimeout(function () {
        dino?.classList.remove("jump");
        // setEarned(false);
      }, 400);
    }
  }

  const balance = async () => {
    const balance = await daiToken.methods
      .balanceOf(DAI_ADDRESS)
      .call(function (err, res) {
        if (err) {
          return err;
        }
        return `The balance is:  ${res}`;
      });
    setBalanceDT(balance);
    console.log(balance);
  };

  const earnToken = async () => {
    await daiToken.methods
      .transfer(DAI_ADDRESS, points)
      .send({ from: hostId })
      .then(function (err, res) {
        if (err) {
          return err;
        }
        setBalanceDT((prev) => (prev += points));
        setPoints(0);
        balance();
        return `The balance increased:  ${res}`;
      });
  };

  const upgrade = async () => {
    if (balanceDT >= 10) {
      await daiToken.methods
        .transfer(DAI_ADDRESS, 10)
        .send({ from: hostId })
        .then(function (err, res) {
          if (err) {
            return err;
          }
          setBalanceDT((prev) => (prev -= 10));
          setPoints(0);
          setStats((prev) => (prev.amount += 1));
          balance();
          return `The balance decreased:  ${res}`;
        });
    } else {
      alert("not enough balance");
    }
  };

  const startAgain = () => {
    balance();
    setHasStarted(true);
    setDefeated(false);
  };

  useEffect(() => {
    if (hasStarted) {
      let isAlive = setInterval(function () {
        // get current dino Y position
        let dinoTop = parseInt(
          window.getComputedStyle(dino).getPropertyValue("top")
        );
        let dinoLeft = parseInt(
          window.getComputedStyle(dino).getPropertyValue("left")
        );

        // get current cactus X position
        let cactusLeft = parseInt(
          window.getComputedStyle(cactus).getPropertyValue("left")
        );

        let coinLeft = parseInt(
          window.getComputedStyle(point).getPropertyValue("left")
        );

        // detect collision
        if (dinoTop <= 130 && coinLeft < 50 && coinLeft > 0) {
          setPoints((prev) => (prev += stats.earning));
          // setEarned(true);
        }

        if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 120) {
          // collision
          setHasStarted(false);
          setDefeated(true);
        }
      }, 100);
    }
  }, [hasStarted]);

  document.addEventListener("keydown", function (event) {
    jump();
  });

  return (
    <div className="game">
      <div id="dino" />
      <div id="earned-points">{points}</div>
      <div id={hasStarted ? "cactus-moving" : "cactus"} />
      <div id={"point"} className={hasStarted && "point-moving"} />
      <div>
        {defeated && <div id="gameOver"> GAME OVER</div>}
        {!hasStarted && (
          <div id="playAgain" onClick={startAgain}>
            {" "}
            Start
          </div>
        )}
        {points > 0 && !hasStarted && (
          <button className="button" onClick={earnToken}>
            Collect
          </button>
        )}
        <div></div>
        <button className="button" onClick={upgrade}>
          upgrade
        </button>
        <h3>Level: {stats.earning}</h3>
        <span id="balance">{balanceDT}</span>
      </div>
    </div>
  );
};

export default Dino;
