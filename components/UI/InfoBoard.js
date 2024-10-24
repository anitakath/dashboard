

const InfoBoard = ({setInfoBoardOpen, infoBoardOpen, setInfoBoardDetails, infoBoardDetails}) =>{


    return (
      <div className=" bg-white absolute h-full w-full overflow-scroll">
        <div className="flex justify-between">
          <h1 className="relative left-5 top-2 p-2 text-2xl"> Infoboard</h1>
          <button
            className="relative right-5 top-2 border-2 p-2"
            onClick={() => setInfoBoardOpen(false)}
          >
            close board
          </button>
        </div>

        <div className=" my-4 flex justify-center">
          {infoBoardDetails === "Registration with the help of Supabase" && (
            <div className="border-8 w-6/12 my-4 p-4 bg-red-100 flex flex-col items-center">
              <h1 className="text-2xl">
                Registration with help of Supabase
              </h1>
              <p className="border-2 m-2 text-xl bg-white p-2 leading-9">
                due to some
                <strong>
                  changes in the authentication and registration logic
                </strong>
                by Supabase, an e-mail confirmation is now required to ensure
                that users are using real e-mail addresses, for example, but
                also to avoid spam and improve the overall user experience
              </p>
              <p className="border-2 m-2 text-xl bg-white p-2 leading-9">
                To send emails for authentication,
                <strong>Supabase requires an SMTP </strong>
                server. One provider I know of for such a service is Resend.
                Resend makes it possible to send e-mails.
              </p>
              <p className="border-2 m-2 text-xl bg-white p-2 leading-9">
                In order to use Resend or similar services effectively, I
                <strong> need my own domain </strong> that I can control. This
                is necessary to ensure that the emails are sent from a
                trustworthy source and to avoid problems with spam filters.
              </p>
              <p className="border-2 m-2 text-xl bg-white p-2 leading-9">
                Since <strong>I host my website via Netlify </strong> and do not
                have my own domain, but only use a Netlify subdomain, I cannot
                use Resend to send my e-mails.
              </p>
              <p className="border-2 m-2 text-xl bg-white p-2">
                Without a custom domain and without the ability to configure an
                SMTP service such as Resend, it will be difficult to register
                new users via Supabase Auth as the required email confirmations
                cannot be sent.
              </p>
              <p className="border-2  m-2 text-xl bg-white p-2 leading-9">
                there are also services that allow you to send e-mails without
                your own domain (e.g. Mailgun), or other ways of authentication
                (Firebase Auth) - but I would like to point out at this point to
                use my already registered e-mail address and my password to get
                access to this demo project.
              </p>

              <h1 className="text-2xl my-2">
                <strong>
                  To get access to my profile please contact me at
                  wagner.annekathrin@gmx.de 💜
                </strong>
              </h1>
            </div>
          )}
        </div>
      </div>
    );
}

export default InfoBoard