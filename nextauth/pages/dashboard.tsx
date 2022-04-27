import { GetServerSideProps } from "next";
import { User } from "../@types";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRGuestAuth";

interface Props {
   user: User | null;
};

export default function Dashboard(props: Props) {
   const { user } = props;

   return(
      <h1>Dashboard { user?.email }</h1>
   );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth<{ user: User | null }>(async context => {
   const apiClient = setupApiClient(context);

   const { data: user, status } = await apiClient.get<User>('/me');

   if(status == 200) {
      return {
         props: {
            user,
         }
      }
   } else {
      return {
         props: {
            user: null,
         }
      }
   }
});