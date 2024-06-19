import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {TabScreensProps} from '../../../types/navigation';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {TodoItem, deleteTodoItem, getTodoItems} from '../../../../helper';
import styles from './styles';
import {
  AddButton,
  AddUpdateTodo,
  Loader,
  TodoListItem,
} from '../../../components';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import typography from '../../../styles/typography';

const PAGE_LIMIT = 6;

const Home = ({}: TabScreensProps<'Home'>) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['todos'],
    initialPageParam: 0,
    queryFn: ({pageParam}) => {
      return getTodoItems(pageParam, PAGE_LIMIT);
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const {mutate: deleteTodo, isPending: isDeleting} = useMutation({
    mutationFn: ({id}: {id: string}) => {
      return deleteTodoItem(id);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const addTodoSheetRef = useRef<BottomSheetModal>(null);
  const handleEditItem = (props: {id: string; title: string}) => {
    addTodoSheetRef.current?.present(props);
  };

  const renderTodoItem: ListRenderItem<TodoItem> = ({item}) => {
    return (
      <TodoListItem {...item} onDelete={deleteTodo} onEdit={handleEditItem} />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading || isFetching) {
      return <ActivityIndicator size={'large'} />;
    }
    return (
      <Text style={typography.caption}>
        No, Todo items found Please add new
      </Text>
    );
  };

  const handleOnEndReach = () => {
    if (isFetching || isFetchingNextPage || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };
  const renderListFooterComponent = () => {
    if (isFetchingNextPage) {
      return <ActivityIndicator size="large" />;
    }
    if (!hasNextPage) {
      return (
        <Text style={typography.caption}>You all catch up,no more todo</Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.screenContainer}>
      <FlatList
        onEndReached={handleOnEndReach}
        data={data?.pages.flat()}
        renderItem={renderTodoItem}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
      />
      <AddButton
        onPress={() => {
          addTodoSheetRef.current?.present();
        }}
      />
      <AddUpdateTodo ref={addTodoSheetRef} />
      <Loader isLoading={isDeleting} />
    </View>
  );
};

export default Home;
