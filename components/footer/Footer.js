import React from "react";

const Footer = () => {

  return (
      <div className="bg-black">
        <div className="flex flex-col justify-center items-center mb-10 text-[#9DA1A2] font-['Montserrat-Variable sans-serif']">
          <div className="flex justify-center items-center gap-4">
            <a href="https://twitter.com/EZswapProtocol" target="_blank">
              <img className="w-[50px]" src="/twitter.png"/>
            </a>
            <a href="https://discord.gg/uv77nneRxd" target="_blank">
              <img className="w-[50px]" src="/discord.png"/>
            </a>
            <a href="https://ezswap.gitbook.io/ezswapprotocol/" target="_blank">
              Docs
            </a>
            <a href="https://ezswap.readme.io/reference/overview" target="_blank">
              API
            </a>
            <a href="/terms.html" target="_blank">
              Terms
            </a>
            <a href="/privacy.html" target="_blank">
              Privacy
            </a>
          </div>
          <div className="color-[#9DA1A2]">
            Audited by:
            <a className="ml-2" href="https://www.beosin.com/audits/EZSwap_202402271505.pdf" target="_blank">
              Beosin
            </a>
          </div>
        </div>
      </div>
  );
};

export default Footer;
