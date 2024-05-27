import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Header: React.FC = () => {
    return (
        <AppBar position="fixed" className="!bg-slate-800">
            <Toolbar>
                <Typography variant="h6">
                    Phases
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;