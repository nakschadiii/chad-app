import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const notLoggedPage = ({ socket }) => {
    return (
        <div>
            <LoginForm socket={socket} />
            <RegisterForm socket={socket} />
        </div>
    );
}  

export default notLoggedPage;