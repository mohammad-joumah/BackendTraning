import download from "../download.png"
function Footer(){
    return(
        <div className="footer">
            <section className=" bg-dark pt-4">
                <div className="container pt-10 pb-2">
                    <div className="row">
                        <div className="col-md-6 d-flex ">
                            <img src={download} className="logo-light rounded " alt="" height="20"/>
                            <p>Mohammad Joumah</p>
                            
                        </div>

                        <div className="col-md-4 offset-md-2">
                            <h5 className="text-white f-17">contact</h5>
                            <a href="#">xing.com/profile/Mohammed_Joumah2</a><br />
                            <a href="#">linkedin.com/in/mohammad-joumah/</a><br />
                            <a href="#">github.com/mohammad-joumah</a><br />
                        </div>

                    </div>

                    <div className="row mt-5">
                        <div className="col-md-12">
                            <div className="text-center">
                                <p>Copy@Mohammad.Joumah, {new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
    {/* // return <div>
    //     <h3>this is footer</h3>
    // </div> */}
}
export default Footer;