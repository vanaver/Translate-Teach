import { useParams } from "react-router-dom";

function SinglePage() {
    const {title} = useParams()

    return(
        <div>
            <h3>slovar name</h3>
            <p>slobvar description</p>
            <p>{title}</p>
        </div>
    )
};

export default SinglePage;