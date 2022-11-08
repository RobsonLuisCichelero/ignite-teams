import { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { groupsGetAll } from "@storage/group/groupsGetAll";

import { Container } from "./styles";

import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Hightlight } from "@components/Hightlight";
import { ListEmpty } from "@components/ListEmpty"
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";

export function Groups(){
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate("new");
  }

  async function fechtGroups(){
    try {
      setIsLoading(true);
      const data: string[] = await groupsGetAll();

      setGroups(data);
    } catch(error){
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate("players", { group })
  }

  useFocusEffect(useCallback(() => {
    fechtGroups();
  }, []))

  return (
    <Container>
      <Header />
      <Hightlight 
        title="Turmas"
        subtitle="jogue com a sua turma"
      />

      { isLoading ? 
        <Loading /> : 
        (
          <FlatList 
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <GroupCard 
                onPress={() => handleOpenGroup(item)} 
                title={item} 
              />
            )}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty message="Que tal cadastrar a primeira turma?" />
            )}
          />
        )
      }
      
      <Button 
        title="Criar nova turma"
        onPress={handleNewGroup}
      />
    </Container>
  );
}